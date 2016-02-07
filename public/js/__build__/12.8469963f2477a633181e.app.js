webpackJsonp([12],{444:function(e,a){e.exports={"account-form.error.unknown":"There was an unknown error. Please try again.","account-form.error.displayName":"This Company Name was already used","account-form.message.add-account-title":"Change your login information","account-form.label.displayName":"What’s your name?","account-form.label.email":"What’s your email address?","account-form.description.email":"This is where we send your password reset instructions.","account-form.cancel":"Cancel","account-form.action.save-account":"Change","account-form.action.saving-account":"Saving…","account-page.title":"Account","accounts-page.title":"Chart of Accounts","account-page.subtitle":"Settings","account-page.login-info-legend":"Account Info","account-page.login-info-message":"Update the personal information linked to this account.","account-page.login-info-label":"Change your login information","account-page.login-info-description":"This is where you can change your email address or password.","account-page.action-change-login-info":"Change my login information","action.create-new-app":"Create a new app","message.created":"Created","message.filter-companies":"Start typing to filter…","message.no-data":"No data to display.","app-settings-page.title":"Settings","apps-menu-item-title":"Your Companies","account-settings-menu-item-title":"Account AccountSettings","error.unknown":"There was an unknown error. Please try again.","error.displayName":"This Company Name was already used","message.add-company-title":"Create a new company","message.add-company-subtitle":"Just give it a name first…","label.displayName":"What should we call it?","description.displayName":"This is how we’ll reference it. Don’t use any special characters, and start your name with a letter.","placeholder.displayName":"Pick a good name…","label.periodType":"What type of Period do you need?",MONTHLY:"MONTHLY",TRIMESTERLY:"TRIMESTERLY",cancel:"Cancel","action.save-company":"Create it!","action.saving-company":"Saving…","dashboard-page.title":"Home","forgot-page.abort-message":"Never mind, go back","forgot.help-message":"<span>That's okay. Enter your email and we'll send</span>\n            <br/><span>you a way to reset your password.\n            </span>","title.forgot":"Reset your password","forgot.default-forgot":"amadou.cisse@epsilon.ma","forgot-form.title":"Reset your password","forgot-page.label.email":"Email","error.login":"You must enter a valid e-mail address.","forgot-page.action-reset":"Reset password","title.login":"Login","login.default-login":"amadou.cisse","login-form.title":"Member Login","label.email":"Email","label.password":"Password","login.forgot-something":"Forgot something?","action.login":"Log In","reports-page.title":"Reports","sidebar.all-apps":"All Companies","sidebar.new-app":"Create a new app","app-dashboard-menu-item-title":"Dashboard","transactions-menu-item-title":"Transactions","accounts-menu-item-title":"Chart of Accounts","reports-menu-item-title":"Reports","app-settings-menu-item-title":"Settings","transaction-form.th.account":"Acccount","transaction-form.th.DEBIT":"DEBIT","transaction-form.th.CREDIT":"CREDIT","transaction-form.th.Description":"Description","transaction-form.th.Name":"Name","transaction-form.error.unknown":"There was an unknown error. Please try again.","transaction-form.message.searchPromptText":"Select Account…","transaction-form.message.accountPlaceholder":"Select Account…","transaction-form.message.searchingText":"Searching…","transaction-form.date.clearButton":"Select Date","transaction-form.account-combobox.emptyFilter":"The filter returned no results","transaction-form.date_label":"Journal Date","transaction-form.add_more_lines":"Add lines","transaction-form.clear_all_lines":"Clear all lines","transaction-form.memo":"Enter a note for this journal entry","transaction-form.error.displayName":"This Company Name was already used","transaction-form.message.add-transaction-title":"Journal Entry #{transactionNumber}","transaction-form.message.total":"Total","transaction-form.cancel":"Cancel","transaction-form.action.save":"Save","transaction-form.action.save-and-new":"Save and new","transaction-form.action.saving-transaction":"Saving…","journal-page.subtitle":"Journal","app.title":"Compta • Accounting Manager","error.required":"Required","error.invalid-email":"Invalid email address"}},1520:function(e,a,n){var o;!function(a){e.exports=a()}(function(){return function e(a,n,t){function l(r,i){var s,p,m;if(!n[r]){if(!a[r]){if(s="function"==typeof o&&o,!i&&s)return o(r,!0);if(c)return c(r,!0);throw p=new Error("Cannot find module '"+r+"'"),p.code="MODULE_NOT_FOUND",p}m=n[r]={exports:{}},a[r][0].call(m.exports,function(e){var n=a[r][1][e];return l(n?n:e)},m,m.exports,e,a,n,t)}return n[r].exports}var r,c="function"==typeof o&&o;for(r=0;r<t.length;r++)l(t[r]);return l}({1:[function(e,a,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=[{locale:"en",pluralRuleFunction:function(e,a){var n=String(e).split("."),o=!n[1],t=Number(n[0])==e,l=t&&n[0].slice(-1),r=t&&n[0].slice(-2);return a?1==l&&11!=r?"one":2==l&&12!=r?"two":3==l&&13!=r?"few":"other":1==e&&o?"one":"other"},fields:{year:{displayName:"Year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{one:"in {0} year",other:"in {0} years"},past:{one:"{0} year ago",other:"{0} years ago"}}},month:{displayName:"Month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{one:"in {0} month",other:"in {0} months"},past:{one:"{0} month ago",other:"{0} months ago"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{one:"in {0} day",other:"in {0} days"},past:{one:"{0} day ago",other:"{0} days ago"}}},hour:{displayName:"Hour",relativeTime:{future:{one:"in {0} hour",other:"in {0} hours"},past:{one:"{0} hour ago",other:"{0} hours ago"}}},minute:{displayName:"Minute",relativeTime:{future:{one:"in {0} minute",other:"in {0} minutes"},past:{one:"{0} minute ago",other:"{0} minutes ago"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{one:"in {0} second",other:"in {0} seconds"},past:{one:"{0} second ago",other:"{0} seconds ago"}}}}},{locale:"en-001",parentLocale:"en"},{locale:"en-150",parentLocale:"en-GB"},{locale:"en-GB",parentLocale:"en-001"},{locale:"en-AG",parentLocale:"en-001"},{locale:"en-AI",parentLocale:"en-001"},{locale:"en-AS",parentLocale:"en"},{locale:"en-AU",parentLocale:"en-GB",fields:{year:{displayName:"Year",relative:{0:"This year",1:"Next year","-1":"Last year"},relativeTime:{future:{one:"in {0} year",other:"in {0} years"},past:{one:"{0} year ago",other:"{0} years ago"}}},month:{displayName:"Month",relative:{0:"This month",1:"Next month","-1":"Last month"},relativeTime:{future:{one:"in {0} month",other:"in {0} months"},past:{one:"{0} month ago",other:"{0} months ago"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{one:"in {0} day",other:"in {0} days"},past:{one:"{0} day ago",other:"{0} days ago"}}},hour:{displayName:"Hour",relativeTime:{future:{one:"in {0} hour",other:"in {0} hours"},past:{one:"{0} hour ago",other:"{0} hours ago"}}},minute:{displayName:"Minute",relativeTime:{future:{one:"in {0} minute",other:"in {0} minutes"},past:{one:"{0} minute ago",other:"{0} minutes ago"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{one:"in {0} second",other:"in {0} seconds"},past:{one:"{0} second ago",other:"{0} seconds ago"}}}}},{locale:"en-BB",parentLocale:"en-001"},{locale:"en-BE",parentLocale:"en-GB"},{locale:"en-BM",parentLocale:"en-001"},{locale:"en-BS",parentLocale:"en-001"},{locale:"en-BW",parentLocale:"en-001"},{locale:"en-BZ",parentLocale:"en-001"},{locale:"en-CA",parentLocale:"en"},{locale:"en-CC",parentLocale:"en-001"},{locale:"en-CK",parentLocale:"en-001"},{locale:"en-CM",parentLocale:"en-001"},{locale:"en-CX",parentLocale:"en-001"},{locale:"en-DG",parentLocale:"en-GB"},{locale:"en-DM",parentLocale:"en-001"},{locale:"en-Dsrt",pluralRuleFunction:function(e,a){return"other"},fields:{year:{displayName:"Year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{other:"+{0} y"},past:{other:"-{0} y"}}},month:{displayName:"Month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{other:"+{0} m"},past:{other:"-{0} m"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{other:"+{0} d"},past:{other:"-{0} d"}}},hour:{displayName:"Hour",relativeTime:{future:{other:"+{0} h"},past:{other:"-{0} h"}}},minute:{displayName:"Minute",relativeTime:{future:{other:"+{0} min"},past:{other:"-{0} min"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{other:"+{0} s"},past:{other:"-{0} s"}}}}},{locale:"en-ER",parentLocale:"en-001"},{locale:"en-FJ",parentLocale:"en-001"},{locale:"en-FK",parentLocale:"en-GB"},{locale:"en-FM",parentLocale:"en-001"},{locale:"en-GD",parentLocale:"en-001"},{locale:"en-GG",parentLocale:"en-GB"},{locale:"en-GH",parentLocale:"en-001"},{locale:"en-GI",parentLocale:"en-GB"},{locale:"en-GM",parentLocale:"en-001"},{locale:"en-GU",parentLocale:"en"},{locale:"en-GY",parentLocale:"en-001"},{locale:"en-HK",parentLocale:"en-GB"},{locale:"en-IE",parentLocale:"en-GB"},{locale:"en-IM",parentLocale:"en-GB"},{locale:"en-IN",parentLocale:"en-GB"},{locale:"en-IO",parentLocale:"en-GB"},{locale:"en-JE",parentLocale:"en-GB"},{locale:"en-JM",parentLocale:"en-001"},{locale:"en-KE",parentLocale:"en-001"},{locale:"en-KI",parentLocale:"en-001"},{locale:"en-KN",parentLocale:"en-001"},{locale:"en-KY",parentLocale:"en-001"},{locale:"en-LC",parentLocale:"en-001"},{locale:"en-LR",parentLocale:"en-001"},{locale:"en-LS",parentLocale:"en-001"},{locale:"en-MG",parentLocale:"en-001"},{locale:"en-MH",parentLocale:"en"},{locale:"en-MO",parentLocale:"en-GB"},{locale:"en-MP",parentLocale:"en"},{locale:"en-MS",parentLocale:"en-001"},{locale:"en-MT",parentLocale:"en-GB"},{locale:"en-MU",parentLocale:"en-001"},{locale:"en-MW",parentLocale:"en-001"},{locale:"en-MY",parentLocale:"en-001"},{locale:"en-NA",parentLocale:"en-001"},{locale:"en-NF",parentLocale:"en-001"},{locale:"en-NG",parentLocale:"en-001"},{locale:"en-NR",parentLocale:"en-001"},{locale:"en-NU",parentLocale:"en-001"},{locale:"en-NZ",parentLocale:"en-GB"},{locale:"en-PG",parentLocale:"en-001"},{locale:"en-PH",parentLocale:"en-001"},{locale:"en-PK",parentLocale:"en-GB"},{locale:"en-PN",parentLocale:"en-001"},{locale:"en-PR",parentLocale:"en"},{locale:"en-PW",parentLocale:"en-001"},{locale:"en-RW",parentLocale:"en-001"},{locale:"en-SB",parentLocale:"en-001"},{locale:"en-SC",parentLocale:"en-001"},{locale:"en-SD",parentLocale:"en-001"},{locale:"en-SG",parentLocale:"en-GB"},{locale:"en-SH",parentLocale:"en-GB"},{locale:"en-SL",parentLocale:"en-001"},{locale:"en-SS",parentLocale:"en-001"},{locale:"en-SX",parentLocale:"en-001"},{locale:"en-SZ",parentLocale:"en-001"},{locale:"en-TC",parentLocale:"en-001"},{locale:"en-TK",parentLocale:"en-001"},{locale:"en-TO",parentLocale:"en-001"},{locale:"en-TT",parentLocale:"en-001"},{locale:"en-TV",parentLocale:"en-001"},{locale:"en-TZ",parentLocale:"en-001"},{locale:"en-UG",parentLocale:"en-001"},{locale:"en-UM",parentLocale:"en"},{locale:"en-US",parentLocale:"en"},{locale:"en-US-POSIX",parentLocale:"en-US"},{locale:"en-VC",parentLocale:"en-001"},{locale:"en-VG",parentLocale:"en-GB"},{locale:"en-VI",parentLocale:"en"},{locale:"en-VU",parentLocale:"en-001"},{locale:"en-WS",parentLocale:"en-001"},{locale:"en-ZA",parentLocale:"en-001"},{locale:"en-ZM",parentLocale:"en-001"},{locale:"en-ZW",parentLocale:"en-001"}],a.exports=n.default},{}]},{},[1])(1)})}});
//# sourceMappingURL=12.8469963f2477a633181e.app.js.map