/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Youtube link enhancement', function () {
  describe('embed behaviour', function () {
    var container

    beforeEach(function () {
      container = document.createElement('div')
    })

    afterEach(function () {
      document.body.removeChild(container)
    })

    it('replaces a link and it\'s container with a media-player embed', function () {
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

    it('doesn\'t replace links when a user has revoked campaign cookie consent', function () {
      window.GOVUK.cookie('cookies_policy', JSON.stringify({ campaigns: false }))

      container.innerHTML =
        '<div class="gem-c-govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(2)
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
      container = document.createElement('div')
    })

    afterEach(function () {
      document.body.removeChild(container)
    })

    it('replaces a livestream link and it\'s container with a media-player embed', function () {
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

      container.innerHTML =
        '<div class="gem-c-govspeak">' +
          '<p><a href="https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ">Agile at GDS</a></p>' +
        '</div>'
      document.body.appendChild(container)

      var element = document.querySelector('.gem-c-govspeak')
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement(element)
      enhancement.init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
      expect(document.querySelectorAll('.gem-c-govspeak p, .gem-c-govspeak a').length).toBe(2)
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
})
