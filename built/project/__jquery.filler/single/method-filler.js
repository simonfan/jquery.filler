define(["require","exports","module","jquery","lodash"],function(e,t,n){var r=e("jquery"),i=e("lodash"),s=n.exports=function(t,n){var r=n.name,s=n.arguments;return function(n){var o=i.clone(s);return o.push(n),t[r].apply(t,o)}}});