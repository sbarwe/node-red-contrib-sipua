/*
- config node for choosing sip server
- in node for incomoing calls or data 
- out node for outgoing calls or date (dtmf, sound)


*/

var sipster = require("sipster");
// wait 2s till we answer a call
const waitTillAnswering = 5000;
const DEBUG = false;
const registrarIp = '192.168.178.1';
const realm = 'fritz.box';
const username = '623';
const password = '623623623';

// initialize pjsip
sipster.init({
  uaConfig: { userAgent: "node-red-contrib-sipua" },
  logConfig: { consoleLevel: DEBUG ? 5 : 1 }
});

// set up a transport to listen for incoming connections, defaults to UDP
var transport = new sipster.Transport({ port: 5060 });


// set up a SIP account, we need at least one -- as required by pjsip.
// this sets up an account for calls coming from 192.168.100.10
var acct = new sipster.Account({
  idUri: "sip:"+username+"@"+registrarIp,
  regConfig: {
    registrarUri: "sip:"+registrarIp,
    timeoutSec: 300
  },
  sipConfig: {
    authCreds: [
      {
        scheme: "digest",
        realm: realm,
        username: username,
        dataType: 0,
        data: password /* password = dataType 0 */
      }
    ]
  }
});

var playbackmedia = null;

function pingback() {
  if (playbackmedia == null) return;
  var player = sipster.createPlayer("beep.wav", true);
  player.startTransmitTo(playbackmedia);
  player.on("eof", function() {
    player.close();
  });
}

// watch for incoming calls
acct.on("call", function(info, call) {
  console.log("=== Incoming call from " + info.remoteContact);
  //call.ref();
  // watch for call state changes
  // state --> connecting, confirmed, disconnected
  call.on("state", function(state) {
    console.log("=== Call state is now: " + state.toUpperCase());
  });

  // listen for DTMF digits
  call.on("dtmf", function(digit) {
    console.log("=== DTMF digit received: " + digit);
    if (digit == "#") pingback();
  });

  // audio stream(s) available
  call.on("media", function(medias) {
    // play looping .wav file to the first audio stream
    var player = sipster.createPlayer("speech.wav", true);
    setTimeout(
      function() {
        player.startTransmitTo(medias[0]);
      },
      1000
    );

    player.on("eof", function() {
      player.close();
    });
    playbackmedia = medias[0];
    // record the audio of the other side, this will not include the audio from
    // the player above.
    // var recorder = sipster.createRecorder('call.wav');
    // medias[0].startTransmitTo(recorder);
    // to include the player audio, you can mix the sources together simply
    // by transmitting to the same recorder:
    //   player.startTransmitTo(recorder);
  });

  // answer the call (with default 200 OK)
  setTimeout(
    function() {
      playbackmedia = null;
      if (call.isActive)
       call.answer();
    },
    waitTillAnswering
  );
});

// finalize the pjsip initialization phase ...
sipster.start();
//acct.makeCall("sip:015759@192.168.178.1");
//acct.makeCall("sip:**610@192.168.178.1");
