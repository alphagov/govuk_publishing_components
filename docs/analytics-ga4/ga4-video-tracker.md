# Google Analytics 4 video tracker

This script tracks interactions with videos on GOV.UK. It sends an event to the dataLayer when any of the following occur.

- a video starts playing
- a video reaches the end
- a video gets to 25%, 50%, or 75% of the way through

These events only fire once for each video on any given page. Below is an example of the data sent to the dataLayer for a specific video, on beginning of playback.

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'video_start',
    'type': 'video',
    'url': 'https://www.youtube.com/watch?v=TvHpBXB0q0Y',
    'text': 'My first Self Assessment tax return',
    'action': 'start',
    'video_current_time': 0,
    'length': 152,
    'video_percent': 0
  }
}
```

## How it works

Assuming that consent has been given, the video tracker is launched automatically by the [Youtube link enhancement script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/lib/govspeak/youtube-link-enhancement.js). Note that if cookie consent is not given, videos are not loaded on GOV.UK. Instead the user is shown a link to the video.

The Youtube enhancement script creates an embedded Youtube player based on a link to a video. This includes the `enablejsapi` option, which is needed for tracking. The `onStateChange` event provided by the Youtube API allows code to be executed when a user interacts with a video, for example when playing or pausing.

The function attached to this event listener calls the GA4 video tracker. Since there is no event fired during playback, in order to track progress (e.g. reaching 25%) an interval is created once a second, that checks progress using calls to the Youtube API. When it reaches one of the percentage positions it pushes information to the dataLayer and records that this event should not be fired again.
