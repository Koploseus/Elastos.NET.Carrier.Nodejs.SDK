import _ from 'lodash';
import ffmpeg from 'fluent-ffmpeg';


const spawn = nw.require('child_process').spawn;
const fs = nw.require('fs');
const Writable = nw.require('stream').Writable;
const DIR = nw.process.cwd()+'/.files/';

class OutStream extends Writable {

  constructor(options){
    super(options);

    this.write_fn = _.noop();
  }

  setWriteFunction(func){
    this.write_fn = func;
  }

  _write(chunk, enc, done) {
    // 转大写之后写入标准输出设备
    console.log(111, chunk);

    this.write_fn(chunk, done);

  }
}

export default class {
  constructor(){
    this.stream = null;
  }

  async openMedia(out_stream){

    out_stream.on('finish', ()=>{
      console.log('finish');
    })

    const x = '/Users/jacky.li/Desktop/test.mp4';


    // const arg = '-f avfoundation -framerate 30 -video_size 640x480 -i 0 -vcodec libx264 -preset ultrafast -acodec libfaac -f mpeg pipe:1';
    // const arg = '-i /Users/jacky.li/Desktop/test.mp4 -video_size 640x480 -c:v libx264 -profile:v baseline -level 3.0 -pass 1 -f mpeg -movflags frag_keyframe+empty_moov pipe:1';
    // http://221.228.226.5/15/t/s/h/v/tshvhsxwkbjlipfohhamjkraxuknsc/sh.yinyuetai.com/88DC015DB03C829C2126EEBBB5A887CB.mp4
    // const arg = '-i /Users/jacky.li/Desktop/test.mp4 -acodec libmp3lame -s 320x240 -f mpeg pipe:1';
    const arg = '-i /Users/jacky.li/Desktop/test.mp4 -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis -f webm pipe:1';
    // const arg = '-f avfoundation -framerate 30 -video_size 640x480 -i 0 -b:v 1M -c:v libvpx -c:a libvorbis -f webm pipe:1';
    const cmd = spawn('ffmpeg', arg.split(' '));
    let pp = {
      buffer : [],
      info : []
    };
    cmd.stdout.on('data', function(data){
      pp.buffer.push(data);
      out_stream.write(data);
      // pp.push(data);
    });


    cmd.stderr.on('data', function(d1){
      console.log('Info from child: ' + d1);
      pp.info.push(d1.toString());
    });

    cmd.on('close', function(code){
      console.log('child exists with code: ' + code);

      console.log(pp);
    });


    return true;

    // cmd.ffprobe((err, metadata)=>{
    //   console.log(err, metadata);
    //   cmd.run();
    // });
  }
}