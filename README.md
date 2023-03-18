# AU Freeview for Channels
> A Playlist & EPG proxy for Channels DVR

AU Freeview for Channels is what is says on the tin - intended for use with [Channels DVR](https://getchannels.com/dvr-server/), this Docker image is a Custom Channels provider, providing Playlist & EPG files that works out of the box with Channels.  

Inspired and built on by the efforts & resources of the legendary [Matt Huisman](https://www.matthuisman.nz), this proxies relevant files from `i.mjh.nz` and transmogrifies them to make them fully work with Channels DVR.

*NOTE*: This DOES NOT proxy the actual streaming feeds from the networks. You will need an Australian IP to access most of these channels.

## Installation
Requires [Docker](http://docker.com).  
Start via your preferred Docker container invocation method:

### CLI
```
docker run -d \
  --name=au-freeview-for-channels \
  -p 11901:3000 \
  -e NODE_ENV=production \
  gabepb/au-freeview-for-channels:latest
```

### Docker Compose
In your preferred location, copy this to `docker-compose.yml`:
```
version: '3'

services:
  au-freeview-for-channels:
    container_name: au-freeview-for-channels
    image: "gabepb/au-freeview-for-channels:latest"
    ports:
      - "11901:3000"
    environment:
      NODE_ENV: production
```  
Run `docker-compose up -d`.  


You should be able to access `http://localhost:11901`; it should return a JSON response of `{"up": true}`. If the Docker instance is not on the same machine as Channels DVR, you'll need to replace `localhost` with the IP of the Docker host for this guide.

## Usage
Once you've spun up the service, add it to your Channels DVR as a Custom Channel.  

- Select the city you wish to use with this Custom Channel, you can [check this page for supported cities](https://i.mjh.nz/au/).
- Go to your Channels DVR (eg. http://localhost:8089) and go to Settings
- Under Basic Setup, in the X sources found, click the Add Source button
- Choose Custom Channels
- Use these settings:
  - Nickname: your choice eg. `Sydney Freeview`
  - Stream Format: HLS
  - Source: URL
    - URL: `http://localhost:11901/playlist/SELECTED_CITY`, replacing `SELECTED_CITY` with eg. `Sydney`
  - Select Options:
    - Refresh URL daily
    - Prefer channel-number from M3U
    - No stream limit
  - XMLTV Guide Data:
    - URL: `http://localhost:11901/epg/SELECTED_CITY`, again, replacing `SELECTED_CITY`
    - Refresh Daily
  - Press Save

Check out your Guide; it should have your new Aussie Freeview channels!

### Channel Numbering
Channel numbers are prefixed, by default, that prefix is 1XXX (eg. for 7two, with an LCN of 72, it's 1072).  

You can change the prefix to your choosing by:
(TODO)

#### Channels without official LCNs (Local Channel Numbers)
Channel that don't have a provided LCN are added to the end of the "channel block", eg. the highest LCN is `99` presented as `1099`; the next non-LCN'd channel is `1101`.

A future release will allow more granular control on how to specify particular channel numbers, eg. if you'd like to group the Channel Seven streaming channels under 1X7X.

### Pop-up/Non-linear Channels
Popup & non-linear channels, like channels with an MJH channel prefix of `mjh-7-cas` and `mjh-abc-90-seconds`, are not included in the channel list by default. To re-include them, or to add additional prefixes to exclude:
(TODO)

## Contributing
All contributions are certainly welcome & appreciated! Simply branch & submit a Pull Request.