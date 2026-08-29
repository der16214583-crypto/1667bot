"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSong = addSong;
exports.skipSong = skipSong;
exports.stopMusic = stopMusic;
exports.queueList = queueList;
const voice_1 = require("@discordjs/voice");
const youtube_dl_exec_1 = __importDefault(require("youtube-dl-exec"));
const child_process_1 = require("child_process");
const queues = new Map();
async function resolveSong(query, requestedBy) {
    try {
        const isUrl = query.startsWith('http://') || query.startsWith('https://');
        const target = isUrl ? query : `ytsearch1:${query}`;
        const info = await (0, youtube_dl_exec_1.default)(target, {
            dumpSingleJson: true,
            noWarnings: true,
            preferFreeFormats: true,
            defaultSearch: 'ytsearch1'
        });
        const video = info.entries ? info.entries[0] : info;
        if (!video)
            return null;
        return {
            title: video.title || 'Bilinmeyen Şarkı',
            url: video.webpage_url || video.url || query,
            requestedBy
        };
    }
    catch (error) {
        console.error('Şarkı arama hatası:', error);
        return null;
    }
}
function createYtdlpStream(url) {
    return (0, child_process_1.spawn)('yt-dlp', [
        url,
        '-f', 'bestaudio[ext=webm]/bestaudio/best',
        '-o', '-',
        '--no-playlist',
        '--quiet',
        '--no-warnings'
    ], {
        stdio: ['ignore', 'pipe', 'pipe']
    });
}
async function playNext(queue) {
    const song = queue.songs[0];
    if (!song) {
        queue.playing = false;
        setTimeout(() => {
            const guildId = queue.interaction.guildId;
            const q = queues.get(guildId);
            if (q && !q.playing && q.songs.length === 0) {
                q.connection.destroy();
                queues.delete(guildId);
            }
        }, 30000);
        return;
    }
    queue.playing = true;
    try {
        const process = createYtdlpStream(song.url);
        process.stderr.on('data', data => {
            const text = data.toString();
            if (text.trim())
                console.error('yt-dlp:', text);
        });
        const resource = (0, voice_1.createAudioResource)(process.stdout, {
            inputType: voice_1.StreamType.Arbitrary
        });
        queue.player.play(resource);
        queue.connection.subscribe(queue.player);
    }
    catch (error) {
        console.error('Şarkı oynatma hatası:', error);
        queue.songs.shift();
        await playNext(queue);
    }
}
async function addSong(interaction, query) {
    const guild = interaction.guild;
    const guildId = interaction.guildId;
    if (!guild || !guildId) {
        return 'Bu komut sadece sunucuda kullanılabilir.';
    }
    const member = interaction.member;
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
        return 'Önce bir ses kanalına girmen lazım.';
    }
    const song = await resolveSong(query, interaction.user.tag);
    if (!song) {
        return 'Şarkı bulunamadı veya YouTube bağlantısı alınamadı.';
    }
    let queue = queues.get(guildId);
    if (!queue) {
        const connection = (0, voice_1.joinVoiceChannel)({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });
        await (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Ready, 30000);
        const player = (0, voice_1.createAudioPlayer)({
            behaviors: {
                noSubscriber: voice_1.NoSubscriberBehavior.Pause
            }
        });
        queue = {
            connection,
            player,
            songs: [],
            interaction,
            playing: false
        };
        player.on(voice_1.AudioPlayerStatus.Idle, async () => {
            queue.songs.shift();
            await playNext(queue);
        });
        player.on('error', async (error) => {
            console.error('Audio player hatası:', error);
            queue.songs.shift();
            await playNext(queue);
        });
        queues.set(guildId, queue);
    }
    queue.songs.push(song);
    if (!queue.playing) {
        await playNext(queue);
    }
    return `🎶 Listeye eklendi: **${song.title}**`;
}
function skipSong(guildId) {
    const queue = queues.get(guildId);
    if (!queue || !queue.songs.length) {
        return 'Çalan şarkı yok.';
    }
    queue.player.stop();
    return '⏭️ Şarkı geçildi.';
}
function stopMusic(guildId) {
    const queue = queues.get(guildId);
    const connection = (0, voice_1.getVoiceConnection)(guildId);
    if (!queue && !connection) {
        return 'Bot şu an müzik çalmıyor.';
    }
    if (queue) {
        queue.songs = [];
        queue.player.stop();
        queue.connection.destroy();
        queues.delete(guildId);
    }
    if (connection) {
        connection.destroy();
    }
    return '⏹️ Müzik durduruldu ve bot sesten çıktı.';
}
function queueList(guildId) {
    const queue = queues.get(guildId);
    if (!queue || !queue.songs.length) {
        return 'Şu an sırada şarkı yok.';
    }
    return queue.songs
        .slice(0, 10)
        .map((song, index) => `${index + 1}. ${song.title} — ${song.requestedBy}`)
        .join('\n');
}
