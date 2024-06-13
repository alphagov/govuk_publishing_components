window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function StatusPageAlert ($module) {
    this.$module = $module
    this.items = {}
    this.incidentCurrent = []
    this.incidentPast = []
    this.maintenanceCurrent = []
    this.maintenanceFuture = []
    this.maintenancePast = []
    this.xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>GOV.UK Status - Incident History</title>
    <link>https://status.publishing.service.gov.uk</link>
    <description>Statuspage</description>
    <pubDate>Mon, 08 Jan 2024 17:43:10 +0000</pubDate>
    <item>
      <title>[maintenanceFuture] GOV.UK Publishing maintenance Tue 16 Jan 12:00-16:00 GMT (future planned maintenance)</title>
      <description>
&lt;p&gt;&lt;strong&gt;THIS IS A SCHEDULED EVENT Jan &lt;var data-var=&apos;date&apos;&gt;16&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;12:00&lt;/var&gt; - &lt;var data-var=&apos;time&apos;&gt;16:00&lt;/var&gt; GMT&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jan &lt;var data-var=&apos;date&apos;&gt; 8&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;16:20&lt;/var&gt; GMT&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Scheduled&lt;/strong&gt; - Hello,&lt;br /&gt;&lt;br /&gt;We plan to do some maintenance work on the GOV.UK Publishing applications on Tue 16 January 2024 between 12:00 and 16:00 GMT.&lt;br /&gt;&lt;br /&gt;Everything should continue to work normally throughout.&lt;br /&gt;&lt;br /&gt;However, if we encounter unforeseen difficulties then there is a chance that publishing new content or changing URLs of existing content might be delayed in taking effect until the maintenance is finished.&lt;br /&gt;&lt;br /&gt;We&apos;re letting you know so that you can plan around these times if you so wish.&lt;br /&gt;If you have highly time-sensitive content to publish at the same time as the maintenance, contact govuk-platform-engineering@digital.cabinet-office.gov.uk in advance and we can reschedule. If emergency publishing is needed on the day, we’ll either roll back the changes or finish them if that will be faster.&lt;br /&gt;&lt;br /&gt;If you encounter problems during or after the maintenance, please contact GOV.​UK support as normal.&lt;br /&gt;&lt;br /&gt;You can follow updates on the GOV.UK Status Page.&lt;br /&gt;&lt;br /&gt;Best wishes,&lt;br /&gt;Chris Banks, on behalf of the GOV.UK Platform Engineering team&lt;br /&gt;&lt;br /&gt;Background information for the curious:&lt;br /&gt;&lt;br /&gt;GOV.UK has a component called Router, which has a database that keeps track of all the pages on www.gov.uk and where to fetch them when users browse the website. We need to move this database to our new Kubernetes infrastructure so that we can finally switch off the old infrastructure. This reduces our engineering costs and helps us keep GOV.UK secure and reliable.&lt;br /&gt;&lt;br /&gt;We&apos;ve designed and tested this change to be zero-impact to you as the user, but we still need to let you know about it because with these things there&apos;s always a chance of unforeseen circumstances arising in production that didn&apos;t come up during testing.&lt;/p&gt;      </description>
      <pubDate>Tue, 16 Jan 2024 12:00:00 +0000</pubDate>
      <maintenanceEndDate>Tue, 16 Jan 2024 16:00:00 +0000</maintenanceEndDate>
      <link>https://status.publishing.service.gov.uk/incidents/cnntrg2j816c</link>
      <guid>https://status.publishing.service.gov.uk/incidents/cnntrg2j816c</guid>
    </item>
  </channel>
</rss>`;
  }

  StatusPageAlert.prototype.init = function () {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(this.xmlString, "text/xml");

    this.items = xmlDoc.documentElement.querySelectorAll("item");
    this.itemsCategorise()
  }

  StatusPageAlert.prototype.itemsCategorise = function() {
    var now = new Date();

    this.items.forEach((item) => {
      // Planned maintenance
      if (item.querySelector('maintenanceEndDate')) {
        var pubDate = Date.parse(item.querySelector('pubDate').textContent)
        var MaintenanceEndDate = Date.parse(item.querySelector('maintenanceEndDate').textContent)
        var currentTime = Date.parse(now)

        if (pubDate > currentTime) {
          this.maintenanceFuture.push(item)
        } else if (pubDate < currentTime && MaintenanceEndDate > currentTime) {
          this.maintenanceCurrent.push(item)
        } else {
          this.maintenancePast.push(item)
        }
      // Incidents
      } else {
        if (item.querySelector('description').textContent.includes('<strong>Resolved</strong>')) {
          this.incidentPast.push(item)
        } else {
          this.incidentCurrent.push(item)
        }
      }
    })

    this.addAlert()
  }

  StatusPageAlert.prototype.addAlert = function() {
    var alertLocation = this.$module
    var alertMessages = alertLocation.querySelectorAll('.alert-message')

    if (this.maintenanceFuture.length > 0 && (this.maintenanceCurrent.length > 0 || this.incidentCurrent.length > 0)) {
      alertMessages[3].style.display = "block"
    } else if (this.maintenanceCurrent.length > 0 || this.incidentCurrent.length > 0) {
      alertMessages[1].style.display = "block"
    } else if (this.maintenanceFuture.length > 0 && this.maintenanceCurrent.length == 0 && this.incidentCurrent.length == 0) {
      var start = new Date(this.maintenanceFuture[0].querySelector('pubDate').textContent)
      var end = new Date(this.maintenanceFuture[0].querySelector('maintenanceEndDate').textContent)

      var startDate = start.toLocaleDateString('en-GB')
      var endDate = end.toLocaleDateString('en-GB')
      var startTime = start.toLocaleTimeString('en-GB')
      var endTime = end.toLocaleTimeString('en-GB')

      alertMessages[2].querySelector('.startDateTime').textContent = `${startDate} at ${startTime}`
      alertMessages[2].querySelector('.startEndTime').textContent = `${endDate} at ${endTime}`
      alertMessages[2].style.display = "block"
    } else {
      alertMessages[0].style.display = "block"
    }
  }

  Modules.StatusPageAlert = StatusPageAlert
})(window.GOVUK.Modules)
