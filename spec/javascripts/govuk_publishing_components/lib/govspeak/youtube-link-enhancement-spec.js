describe('Youtube link enhancement', function () {
  it('replaces a link and it\'s container with a media-player embed', function () {
    var $element = $('<div><p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p></div>')
    var $toReplace = $element.find('p, a')

    var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement($element)
    enhancement.init()

    expect($element.find('.media-player .video').length).toBe(1)
    expect($element.find($toReplace).length).toBe(0)
  })

  it('doesn\'t replace non Youtube links', function () {
    var $element = $('<div><p><a href="https://www.gov.uk/">GOV.UK</a></p></div>')
    var $toReplace = $element.find('p, a')

    var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement($element)
    enhancement.init()

    expect($element.find('.media-player .video').length).toBe(0)
    expect($element.find($toReplace).length).toBe(2)
  })

  it('doesn\'t replace links marked not to embed', function () {
    var $element = $('<div><p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ" data-youtube-player="off">Agile at GDS</a></p></div>')
    var $toReplace = $element.find('p, a')

    var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement($element)
    enhancement.init()

    expect($element.find('.media-player .video').length).toBe(0)
    expect($element.find($toReplace).length).toBe(2)
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

  describe('initLegacy', function () {
    var youtubeHtml = '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>'

    beforeEach(function () {
      setFixtures(
        '<div id="non-component-govspeak" class="govuk-govspeak">' +
          youtubeHtml +
        '</div>' +
        '<div id="component-govspeak" class="gem-c-govspeak govuk-govspeak">' +
          youtubeHtml +
        '</div>'
      )
    })

    it('embeds videos in non-component govspeak elements', function () {
      spyOn(window.GOVUK, 'GovspeakYoutubeLinkEnhancement')
        .and.returnValue(jasmine.createSpyObj('enhancement', ['init']))
      GOVUK.GovspeakYoutubeLinkEnhancement.initLegacy()
      expect(window.GOVUK.GovspeakYoutubeLinkEnhancement).toHaveBeenCalledWith($('#non-component-govspeak'))
    })

    it('doesn\'t embed videos for component govspeak elements', function () {
      spyOn(window.GOVUK, 'GovspeakYoutubeLinkEnhancement')
        .and.returnValue(jasmine.createSpyObj('enhancement', ['init']))
      GOVUK.GovspeakYoutubeLinkEnhancement.initLegacy()
      expect(window.GOVUK.GovspeakYoutubeLinkEnhancement).not.toHaveBeenCalledWith($('#component-govspeak'))
    })
  })
})
