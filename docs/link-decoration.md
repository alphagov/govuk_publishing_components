## What's going on here?
A new function has been written that allows publishing components to add link decoration to links to specific domains listed within the function. It passes on their cookie choices to those specific domains.

## Why is it happening
If a user travels from GOV.UK to another government site they currently see two cookie banners. One on GOV.UK and another on the other site. In a perfect world we'd be able to accept cookies on any domain under .gov.uk and that choice would be persisted through to other government sites. Unfortunately we can't currently have a shared cookie for the whole .gov.uk domain which means to create this world where users click a bit less we have to make some workarounds. In the future we're also hoping that this same link decoration code can be used to help us track users across domains so that we can more effectively improve end to end journeys for our users.

## Exceptions, caveats, missing things and general nuance
This work has been done in two parts, (the first)[pr1] provides the ability to decorate links. It iterates over each page after its loaded, searches for external links and checks those against a list of partners that we're working with. It is only capable of decorating links with a binary yes/no cookie choice though. (The second)[pr2] adds more depth to the users cookie choice and, if they've visited the cookie page and selected their cookies manually, will pass on each cookie choice individually.

If a user shares a link with someone else then it will currently set cookies for that user that they may not want. In the future we'll look at stripping the decoration from the URL after the user lands on the page to mitigate this risk slightly

As the code currently sits, if a user takes the following steps they could end up with more cookies than they want;
- Go to gov.uk and accept cookies
- Click a link to a partner site with link decoration
- Change their mind, visit the partner sites cookie page and decline
- Go to gov.uk in a separate window
In this scenario, gov.uk wouldn't know that they've opted out of cookies somewhere else. This is one of the legislative risks that is currently being looked at by the End to end journeys team. It's not the only situation that is somewhat risky, but if you're looking at this document and it's been merged into main then assume that the legal problems have been worked through! 

[pr1]: www.github.com/alphagov/govuk_publishing_components/pull/5511
[pr2]: www.github.com/alphagov/govuk_publishing_components/pull/5689