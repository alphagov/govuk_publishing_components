'use strict'
// For Universal Analytics' cross domain tracking.
window.GOVUK.analytics = window.GOVUK.analytics || {}
window.GOVUK.analytics.linkedDomains = [
  'access.service.gov.uk',
  'access.tax.service.gov.uk',
  'account.companieshouse.gov.uk',
  'accounts.manage-apprenticeships.service.gov.uk',
  'account.publishing.service.gov.uk',
  'add-driving-licence-check-code.service.gov.uk',
  'analyse-school-performance.service.gov.uk',
  'appeal-tax-tribunal.service.gov.uk',
  'apply-basic-criminal-record-check.service.gov.uk',
  'apply-blue-badge.service.gov.uk',
  'apply-company-tachograph-card.service.gov.uk',
  'apply-for-bankruptcy.service.gov.uk',
  'apply-for-debt-relief-order.service.gov.uk',
  'apply-for-environmental-permit.service.gov.uk',
  'apply-for-eu-settled-status.homeoffice.gov.uk',
  'apply-for-innovation-funding.service.gov.uk',
  'apply-for-refugee-integration-loan.service.gov.uk',
  'apply-licence.ozone-depleting-substances.service.gov.uk',
  'apply-quota.fluorinated-gas.service.gov.uk',
  'apply-quota.ozone-depleting-substances.service.gov.uk',
  'apprenticeships.gov.uk',
  'beta.companieshouse.gov.uk',
  'biometric-residence-permit.service.gov.uk',
  'businessreadinessfund.beis.gov.uk',
  'catchreturn.service.gov.uk',
  'checklegalaid.service.gov.uk',
  'check-mot.service.gov.uk',
  'check-payment-practices.service.gov.uk',
  'check-vehicle-recalls.service.gov.uk',
  'civil-service-careers.gov.uk',
  'civilservicejobs.service.gov.uk',
  'claim.redundancy-payments.service.gov.uk',
  'claim-power-of-attorney-refund.service.gov.uk',
  'compare-school-performance.service.gov.uk',
  'complete-deputy-report.service.gov.uk',
  'contractsfinder.service.gov.uk',
  'coronavirus.data.gov.uk',
  'coronavirus-business-volunteers.service.gov.uk',
  'coronavirus-shielding-support.service.gov.uk',
  'coronavirus-vulnerable-people.service.gov.uk',
  'courttribunalfinder.service.gov.uk',
  'create-energy-label.service.gov.uk',
  'create-qr-code-poster.service.gov.uk',
  'cymraeg.registertovote.service.gov.uk',
  'dartford-crossing-charge.service.gov.uk',
  'design-system.service.gov.uk',
  'devtracker.dfid.gov.uk',
  'digitalmarketplace.service.gov.uk',
  'eforms.homeoffice.gov.uk',
  'electronic-visa-waiver.service.gov.uk',
  'employmenttribunals.service.gov.uk',
  'eu-settled-status-enquiries.service.gov.uk',
  'faster-uk-entry.service.gov.uk',
  'finance.manage-apprenticeships.service.gov.uk',
  'find-and-update.company-information.service.gov.uk',
  'findapprenticeship.service.gov.uk',
  'find-coronavirus-support.service.gov.uk',
  'find-employer-schemes.education.gov.uk',
  'flood-map-for-planning.service.gov.uk',
  'flood-warning-information.service.gov.uk',
  'follow.company-information.service.gov.uk',
  'gender-pay-gap.service.gov.uk',
  'get-fishing-licence.service.gov.uk',
  'get-information-schools.service.gov.uk',
  'gro.gov.uk',
  'helpforhouseholds.campaign.gov.uk',
  'helpwithcourtfees.service.gov.uk',
  'help-with-prison-visits.service.gov.uk',
  'identity.company-information.service.gov.uk',
  'identity-sandbox.company-information.service.gov.uk',
  'import-products-animals-food-feed.service.gov.uk',
  'lastingpowerofattorney.service.gov.uk',
  'live.email-dvla.service.gov.uk',
  'live.dvla-web-chat.service.gov.uk',
  'loststolenpassport.service.gov.uk',
  'makeaplea.service.gov.uk',
  'managefleetvehicles.service.gov.uk',
  'manage-apprenticeships.service.gov.uk',
  'manage-fish-exports.service.gov.uk',
  'manage-quota.fluorinated-gas.service.gov.uk',
  'manage-water-abstraction-impoundment-licence.service.gov.uk',
  'match.redundancy-payments.service.gov.uk',
  'mot-testing.service.gov.uk',
  'nominate-uk-honour.service.gov.uk',
  'notice.redundancy-payments.service.gov.uk',
  'passport.service.gov.uk',
  'paydvlafine.service.gov.uk',
  'payments.service.gov.uk',
  'publish-payment-practices.service.gov.uk',
  'queens-awards-enterprise.service.gov.uk',
  'recruit.manage-apprenticeships.service.gov.uk',
  'register.fluorinated-gas.service.gov.uk',
  'register-trailer.service.gov.uk',
  'register.ozone-depleting-substances.service.gov.uk',
  'registertovote.service.gov.uk',
  'register-vehicle.service.gov.uk',
  'registers.service.gov.uk',
  'reminders.mot-testing.service.gov.uk',
  'renewable-heat-calculator.service.gov.uk',
  'reply-jury-summons.service.gov.uk',
  'report-director-conduct.service.gov.uk',
  'report.fluorinated-gas.service.gov.uk',
  'report.ozone-depleting-substances.service.gov.uk',
  'right-to-rent.homeoffice.gov.uk',
  'right-to-work.service.gov.uk',
  'ruralpayments.service.gov.uk',
  'schools-financial-benchmarking.service.gov.uk',
  'secured.studentfinanceni.co.uk',
  'secured.studentfinancewales.co.uk',
  'selfservice.payments.service.gov.uk',
  'send-money-to-prisoner.service.gov.uk',
  'signin.service.gov.uk',
  'sorn.service.gov.uk',
  'staff.helpwithcourtfees.service.gov.uk',
  'student-finance.service.gov.uk',
  'tax.service.gov.uk',
  'teacherservices.education.gov.uk',
  'teaching-vacancies.service.gov.uk',
  'to-visit-or-stay-in-the-uk.homeoffice.gov.uk',
  'trade-tariff.service.gov.uk',
  'tribunal-response.employmenttribunals.service.gov.uk',
  'ukri.org',
  'update-student-loan-employment-details.service.gov.uk',
  'vehicle-operator-licensing.service.gov.uk',
  'vehicleenquiry.service.gov.uk',
  'viewdrivingrecord.service.gov.uk',
  'view-and-prove-your-rights.homeoffice.gov.uk',
  'view-immigration-status.service.gov.uk',
  'visa-address-update.service.gov.uk',
  'visas-immigration.service.gov.uk',
  'your-defra-account.defra.gov.uk'
]
