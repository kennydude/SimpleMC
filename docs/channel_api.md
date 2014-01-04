# Channel API

Channel API is a way of browsing video websites. It's very early, so it will change a lot!

It is very simple, you have "channels" which are sources of video. An example is "youtube".

## Accessing

Start with `/channels/list.json` and it will output a "Channel Feed". This is like browsing
an imaginary file system. Each object in `data` will consist of:

* `type` = `link` or `video`
* `thumbnail` Thumbnail to use
* `title` Title
* `link` if type=link, where to go for the next batch of content
* `watch` videoKey for playing a video

How to watch a video?

Call in at `/channels/watch/:channel/:videoKey` where `channel` is returned always at `channel`
and video key from the information above.