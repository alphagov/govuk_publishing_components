/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Youtube link enhancement', function () {
  describe('embed behaviour', function () {
    var container

    beforeEach(function () {
      window.GOVUK.cookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      container = document.createElement('div')
    })

    afterEach(function () {
      window.GOVUK.cookie('cookies_policy', null)
      document.body.removeChild(container)
    })

    it('replaces a link and its container with a media-player embed', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>' +
        '<div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(1)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(0)
    })

    it('supports overriding the default class with a custom class', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>' +
        '<div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element, 'custom-class')
      enhancement.init()

      expect(document.querySelectorAll('.custom-class').length).toBe(1)
    })

    it('doesn\'t replace non Youtube links', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
          '<p><a href="https://www.gov.uk">GOV.UK</a></p>' +
        '<div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(2)
    })

    it('doesn\'t replace links marked not to embed', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ" data-youtube-player="off">Agile at GDS</a></p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(2)
    })

    it('doesn\'t replace links when other content is in the paragraph (cookies enabled)', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak" data-module="govspeak">' +
          '<p>We use <a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a> instead of waterfall.</p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(2)
      expect(document.querySelector('.gem-c-govspeak p').innerText).toBe('We use agile at GDS instead of waterfall.')
    })

    it('does replace links when other punctuation is in the paragraph (cookies enabled)', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak" data-module="govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>.</p>' +
          '\n       \n<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>!</p>\n\n' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>?</p>' +
          '<p>"<a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>"</p>' +
          '<p>\'<a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>\'</p>' +
          '<p>"<a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>.?!"</p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(6)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(0)
    })

    it('does replace links when other punctuation is in the paragraph (cookies disabled)', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))

      container.innerHTML =
        '<div class="gem-c-govspeak" data-module="govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>.</p>' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>!</p>' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>?</p>' +
          '<p>"<a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>"</p>' +
          '<p>\'<a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>\'</p>' +
          '<p>"<a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a>.?!"</p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      var links = document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link')
      expect(links.length).toBe(6)

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(6)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').length).toBe(6)

      var expectedLinkText = ['agile at GDS.', 'agile at GDS!', 'agile at GDS?', '"agile at GDS"', '\'agile at GDS\'', '"agile at GDS.?!"']

      for (var i = 0; i < links.length; i++) {
        expect(links[i].textContent).toBe(expectedLinkText[i])
      }
    })

    it('doesn\'t replace links when other HTML is in the paragraph (cookies enabled)', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak" data-module="govspeak">' +
          '<p><img src="agile-gds.png" alt="A sprint board"><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a></p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak img, .gem-c-govspeak a').length).toBe(3)
      expect(document.querySelector('.gem-c-govspeak p').innerText).toBe('agile at GDS')
    })

    it('doesn\'t replace links when other content is in the paragraph (cookies disabled)', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))
      container.innerHTML =
        '<div class="gem-c-govspeak" data-module="govspeak">' +
          '<p>We use <a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a> instead of waterfall.</p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(2)
      expect(document.querySelector('.gem-c-govspeak p').innerText).toBe('We use agile at GDS instead of waterfall.')
      expect(document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(0)
    })

    it('doesn\'t replace links when other HTML is in the paragraph (cookies disabled)', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))
      container.innerHTML =
        '<div class="gem-c-govspeak" data-module="govspeak">' +
          '<p><img src="agile-gds.png" alt="A sprint board"><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">agile at GDS</a></p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak img, .gem-c-govspeak a').length).toBe(3)
      expect(document.querySelector('.gem-c-govspeak p').innerText).toBe('agile at GDS')
      expect(document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(0)
    })

    it('doesn\'t replace links when a user has revoked campaign cookie consent', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))

      container.innerHTML = `
        <div class="gem-c-govspeak">
          <p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>
          <p><a href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t">What are the Discovery, Alpha, Beta and Live stages in developing a service?</a></p>
        </div>
      `
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link').length).toBe(2)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(2)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').textContent).toBe('Agile at GDS')
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').textContent).toBe('What are the Discovery, Alpha, Beta and Live stages in developing a service?')
    })

    it('doesn\'t add "How to watch this video" when embedding is set to disabled', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))

      container.innerHTML = `
        <div class="gem-c-govspeak">
          <p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ" data-youtube-player="off">Agile at GDS</a></p>
          <p><a href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t" data-youtube-player="off">What are the Discovery, Alpha, Beta and Live stages in developing a service?</a></p>
        </div>
      `
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(0)

      expect(document.querySelectorAll('.gem-c-govspeak a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').textContent).toBe('Agile at GDS')

      expect(document.querySelectorAll('.gem-c-govspeak a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').textContent).toBe('What are the Discovery, Alpha, Beta and Live stages in developing a service?')
    })

    it('doesn\'t add "How to watch this video" to some links when only a few are set to disabled', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))

      container.innerHTML = `
        <div class="gem-c-govspeak">
          <p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>
          <p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ?example=2" data-youtube-player="off">Agile at GDS Part 2</a></p>
          <p><a href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t">What are the Discovery, Alpha, Beta and Live stages in developing a service?</a></p>
        </div>
      `
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link').length).toBe(2)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(2)

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').textContent).toBe('Agile at GDS')

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ?example=2"]').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ?example=2"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ?example=2"]').textContent).toBe('Agile at GDS Part 2')

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').textContent).toBe('What are the Discovery, Alpha, Beta and Live stages in developing a service?')
    })

    it('doesn\'t add "How to watch this video" to links that are YT playlists', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))

      container.innerHTML = `
        <div class="gem-c-govspeak">
          <p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>
          <p><a href="https://www.youtube.com/playlist?list=PLFNWGffju2p3CPjLC9eIA3uNmfWjNQjrf">This is a playlist</a></p>
          <p><a href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t">What are the Discovery, Alpha, Beta and Live stages in developing a service?</a></p>
        </div>
      `
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      // Should be zero video enhancements and two cookies disabled messages
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link').length).toBe(2)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(2)

      // First link should get the cookies disabled message
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/watch?v=0XpAtr24uUQ"]').textContent).toBe('Agile at GDS')

      // Playlist link shouldn't get the cookies disabled message
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/playlist?list=PLFNWGffju2p3CPjLC9eIA3uNmfWjNQjrf"]').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak a[href="https://www.youtube.com/playlist?list=PLFNWGffju2p3CPjLC9eIA3uNmfWjNQjrf"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak a[href="https://www.youtube.com/playlist?list=PLFNWGffju2p3CPjLC9eIA3uNmfWjNQjrf"]').textContent).toBe('This is a playlist')

      // Third link should get the cookies disabled message
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://youtu.be/_cyI7DMhgYc?si=A3Z-BiCIDRtOu27t"]').textContent).toBe('What are the Discovery, Alpha, Beta and Live stages in developing a service?')
    })
  })

  describe('parseVideoId', function () {
    it('returns an id for a youtube.com video URL', function () {
      var url = 'https://www.youtube.com/watch?v=0XpAtr24uUQ'
      var id = GOVUK.GovspeakYoutubeLinkEnhancement.parseVideoId(url)

      expect(id).toEqual('0XpAtr24uUQ')
    })

    it('returns an id for a youtu.be video URL', function () {
      var url = 'https://youtu.be/0XpAtr24uUQ'
      var id = GOVUK.GovspeakYoutubeLinkEnhancement.parseVideoId(url)

      expect(id).toEqual('0XpAtr24uUQ')
    })

    it('doesn\'t return an id for a Youtube non video', function () {
      var url = 'https://www.youtube.com/channel/UCSNK6abAoM6Kj0SkHOStNLg'
      var id = GOVUK.GovspeakYoutubeLinkEnhancement.parseVideoId(url)

      expect(id).not.toBeDefined()
    })

    it('doesn\'t return an id for a non youtube link', function () {
      var url = 'https://www.gov.uk'
      var id = GOVUK.GovspeakYoutubeLinkEnhancement.parseVideoId(url)

      expect(id).not.toBeDefined()
    })
  })

  describe('livestream behaviour', function () {
    var container

    beforeEach(function () {
      window.GOVUK.cookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      container = document.createElement('div')
    })

    afterEach(function () {
      window.GOVUK.cookie('cookies_policy', null)
      document.body.removeChild(container)
    })

    it('replaces a livestream link and its container with a media-player embed', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
          '<p><a href="https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ">Livestream</a></p>' +
        '<div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(1)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(0)
    })

    it('doesn\'t replace livestream links marked not to embed', function () {
      container.innerHTML =
        '<div class="gem-c-govspeak">' +
          '<p><a href="https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ" data-youtube-player="off">Agile at GDS</a></p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(2)
    })

    it('doesn\'t replace livestream links when a user has revoked campaign cookie consent', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))

      container.innerHTML = `
        <div class="gem-c-govspeak">
          <p><a href="https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ">Agile at GDS</a></p>
          <p><a href="https://www.youtube.com/embed/live_stream?channel=notarealchannel">What are the Discovery, Alpha, Beta and Live stages in developing a service?</a></p>
        </div>
      `
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak .gem-c-govspeak__youtube-placeholder-link').length).toBe(2)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder').length).toBe(2)
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ"]').textContent).toBe('Agile at GDS')
      expect(document.querySelectorAll('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/embed/live_stream?channel=notarealchannel"]').length).toBe(1)
      expect(document.querySelector('.gem-c-govspeak__youtube-placeholder a[href="https://www.youtube.com/embed/live_stream?channel=notarealchannel"]').textContent).toBe('What are the Discovery, Alpha, Beta and Live stages in developing a service?')
    })
  })

  describe('parseLivestream', function () {
    it('returns a channel id for a youtube.com video URL', function () {
      var url = 'https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ'
      var id = GOVUK.GovspeakYoutubeLinkEnhancement.parseLivestream(url)

      expect(id).toEqual('UCoMdktPbSTixAyNGwb-UYkQ')
    })

    it('doesn\'t return an id for a Youtube non video', function () {
      var url = 'https://www.youtube.com/channel/UCSNK6abAoM6Kj0SkHOStNLg'
      var id = GOVUK.GovspeakYoutubeLinkEnhancement.parseLivestream(url)

      expect(id).not.toBeDefined()
    })

    it('doesn\'t return an id for a non youtube link', function () {
      var url = 'https://www.gov.uk'
      var id = GOVUK.GovspeakYoutubeLinkEnhancement.parseLivestream(url)

      expect(id).not.toBeDefined()
    })
  })

  describe('sanitise video id', function () {
    const expected = 'qZLy91qcB7M'

    it('removes ?si= like params from the path', function () {
      const path = 'qZLy91qcB7M?si=ecMsC8hlHh9TxOnh'
      expect(GOVUK.GovspeakYoutubeLinkEnhancement.sanitiseVideoId(path)).toEqual(expected)
    })

    it('removes &t= like params from the path', function () {
      const path = 'qZLy91qcB7M&t=15s'
      expect(GOVUK.GovspeakYoutubeLinkEnhancement.sanitiseVideoId(path)).toEqual(expected)
    })

    it('removes both ?=si like and &t= like params from the path', function () {
      const path = 'qZLy91qcB7M?si=ecMsC8hlHh9TxOnh&t=15s'
      expect(GOVUK.GovspeakYoutubeLinkEnhancement.sanitiseVideoId(path)).toEqual(expected)
    })

    it('calls sanitiseVideoId in parseVideoId for both youtu.be and youtube.com URLs', function () {
      spyOn(GOVUK.GovspeakYoutubeLinkEnhancement, 'sanitiseVideoId').and.callThrough()

      const urls = ['https://youtu.be/qZLy91qcB7M?si=ecMsC8hlHh9TxOnh&t=15s', 'https://www.youtube.com/watch?v=qZLy91qcB7M?si=ecMsC8hlHh9TxOnh&t=15s', 'https://youtube.com/watch?v=qZLy91qcB7M?si=ecMsC8hlHh9TxOnh&t=15s']

      urls.forEach((url, index) => {
        expect(GOVUK.GovspeakYoutubeLinkEnhancement.parseVideoId(url)).toEqual(expected)
        expect(GOVUK.GovspeakYoutubeLinkEnhancement.sanitiseVideoId.calls.count()).toBe(index + 1)
      })
    })
  })
})
