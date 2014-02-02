//     jquery.filler
//     (c) simonfan
//     jquery.filler is licensed under the MIT terms.

define(["require","exports","module","jquery","lodash","./__jquery.filler/single"],function(e,t,n){var r=e("jquery"),i=e("lodash"),s=e("./__jquery.filler/single"),o=n.exports=function(t,n){arguments.length===1&&(n=t,t=this);var r={};return i.each(n,function(e,n){r[n]=s(t,e)}),function(t){i.each(t,function(e,t){r[t](e)})}};r.prototype.filler=o});