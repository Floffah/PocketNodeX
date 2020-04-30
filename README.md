# PocketNodeX

## What's This?
PocketNodeX is a server software for Minecraft: Bedrock written in node.js, basically is based on PocketNode (a software discontinued based on PocketMine-MP).

## Support
[Telegram](https://t.me/PocketNodeX)
[Discord](https://discord.gg/KMBx63F)

## Some pictures
![Chunks](https://user-images.githubusercontent.com/34418030/63705464-7eec2700-c82d-11e9-8a3e-19fe78459816.png)
![Chat](https://user-images.githubusercontent.com/34418030/63705467-80b5ea80-c82d-11e9-921e-0e0eb4bb5822.png)


## Missing features
- [ ] New chunk format (NEED CONTRIBUTION).
- [ ] Latest minecraft basic support (at the moment is just joinable with empty chunks).
- [ ] Make levels support attached to worlds forlder (now it just generate every time a flat level).
- [ ] Full player features (crunch, jump, swimming) handling.
- [ ] player attributes.
- [ ] find contributors

## Done
- [x] UUID 
- [x] LoginPacket
- [x] TextPacket
- [x] InteractPacket
- [x] new Skins handling method

## Running
It is recommended to delete the directory named `flow` as it is just there in case developers want to write in [flowjs](https://flow.org/)

You should also delete the plugin "TestPlugin" (you can find it at `plugins/testplugin`. Delete that whole folder.)

First Run:
```
$ npm i && node start
```

Afterwards:
```
$ node start

