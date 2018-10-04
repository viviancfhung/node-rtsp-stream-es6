const child_process = require('child_process')
const EventEmitter = require('events')

class Mpeg1Muxer extends EventEmitter {

  constructor(options) {
    super(options)

    this.url = options.url
	const param=[
		"-rtsp_transport", "tcp",
		"-i", this.url,
		'-f', 'mpegts',
		'-codec:v', 'mpeg1video',
		'-b:v', options.bitRate?options.bitRate:'180k'
	];
	if(options.frameRate)	//not less than 20
		param.push("-r",options.frameRate);
	param.push("-");
    this.stream = child_process.spawn("ffmpeg", param, {
      detached: false
    })

    this.inputStreamStarted = true
    this.stream.stdout.on('data', (data) => { return this.emit('mpeg1data', data) })
    this.stream.stderr.on('data', (data) => { return this.emit('ffmpegError', data) })
  }

  stop() {
    this.stream.stdout.removeAllListeners();
    this.stream.stderr.removeAllListeners();
    this.stream.kill();
    this.stream = undefined;
  }
}

module.exports = Mpeg1Muxer
