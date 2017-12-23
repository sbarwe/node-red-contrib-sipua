# node-red-contrib-sipua
Handle calls and DTMF interaction as a SIP user agent for Node-RED


# Installation


# Nodes
## sip-caller
Is used to establish a voice call.

## sip-callee
Is used to announce incomming calls and it is possible to answer them.

# SIP capabilities
## DTMF
It is possible to receive and send DTMF codes on established calls.
A DTMF code is sent with `msg.payload.dtmf`. 

## Voice
not yet implemented.
You can provide a filename to a WAV-file (PCM 44.1kHz, 16Bit, 1ch) in you `settings.js` and choose to run it once or looped.
This file would then be played after a call is established.

## FAX
not yet implemented

## Message
not yet implemented

## Video / Image
not yet implemented

# Configuration


In order to use the the nodes you need a SIP trunk that you can use to deal with the voice calls.
This can be your router or a public internet trunk.
Before you can use the nodes to start a call or to receive a call you need to configure them by
providing the access information to the SIP trunk. 
Other options:
* send DTMF 

After setup you see a successful connection to the SIP trunk by a status message on your nodes ("connected").
The nodes will reconnect automatically on loss of connection.


# Testing
You can test the node by an isolated script by running `npm run test`. You need to setup the settings first.


# Acknowledgements

This node uses the module sipster to handle SIP communication.

# TODO
* Allow streaming of arbitrary audio in both directions (which would allow applications like an answering machine or text to speech service)