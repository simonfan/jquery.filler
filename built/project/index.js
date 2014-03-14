//     jquery.filler
//     (c) simonfan
//     jquery.filler is licensed under the MIT terms.

define(["require","exports","module","jquery","lodash","./__jquery.filler/map-fillers"],function(e,t,n){var r=e("jquery"),i=e("lodash"),s=e("./__jquery.filler/map-fillers"),o=n.exports=function(t,n,r){arguments.length===1&&(n=t,t=this);var o={};o.fillers=s(t,n),o.currentData={};var u=function(u){var a=r?s(t,n):o.fillers,f=o.currentData;i.each(u,function(e,t){if(f[t]!==e){var n=a[t];n&&(n(e),f[t]=e)}})};return u.update=function(){o.fillers=s(t,n)},u};r.prototype.filler=o});