## Auditing

The component guide includes some auditing of components and applications that can provide useful information. It can be found at `/component-guide/audit`.

### Purpose

The aim of the auditing is to provide information about our components and how they are used in frontend applications on GOV.UK. This includes warnings about possible problems with how we are using our component individual asset model. This includes:

- where an application is using a component but has not included required assets
- where an application is not using a component but has included unneeded assets

Note that there may be reasons behind warnings reported by the auditing that mean no action is required. For example, at time of writing the action link component is being used in `collections` and also in the site header, so the Sass for the component is included only in `static`, to prevent duplication. This causes a warning to be raised for `collections`, as it uses the component but doesn't include the Sass.

The auditing also includes other warnings, such as:

- where applications contain jQuery
- where applications are overriding component styles
- where applications are using components that don't exist

### How it works

The auditing has three main areas. Depending on where the component guide is being run, some of this information will not be available.

1. component information (determined from the gem, always available)
2. how the current application is using components (if viewing the component guide inside an application)
3. how all applications are using components (if viewing the component guide running locally in standalone mode, alongside the code for the other applications)

All information is determined by the auditing code performing regular expression matches on files that it can access. This means that when the auditing is running locally it is only as up to date as the repositories on your machine. This also means it can be quite slow to load, as it's doing a lot of things.

The auditing knows what to show based on two values - `@in_application` and `@other_applications`. They determine whether the auditing page includes the tab for 'Applications', and whether the 'Components by application' section of the 'Components' tab is shown.

                               | Remote/local application | Gem running remotely | Gem running locally
------------------------------ | ------------------------ | -------------------- | -------------------
`@in_application`              | true                     | false                | false
`@other_applications`          | false                    | false                | true
Applications tab               | Shows info for this app  | Not shown            | Shows info for all apps
Components by application      | Not shown                | Not shown            | Shown

Note that the combination of true/true for both `@in_application` and `@other_applications` shouldn't be possible - if the gem is inside an application, it can't access other applications.
