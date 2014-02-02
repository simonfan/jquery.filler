//     jquery.filler
//     (c) simonfan
//     jquery.filler is licensed under the MIT terms.

define("__jquery.filler/helpers",["require","exports","module","lodash"],function(e,r){var t=e("lodash");r.splitter=function(e){return new RegExp("\\s*"+e+"\\s*")},r.splitInto=function(e,n,u){n=r.splitter(n),u=u.split(n);var i=e.split(n);return t.zipObject(u,i)}}),define("__jquery.filler/attribute",["require","exports","module","jquery","lodash","./helpers"],function(e,r,t){{var n=(e("jquery"),e("lodash"),e("./helpers"));t.exports=function(e,r){var t=n.splitInto(r,":","method:attribute");return function(r){return e[t.method](t.attribute,r)}}}}),define("__jquery.filler/element",["require","exports","module","jquery","lodash"],function(e,r,t){{var n=(e("jquery"),e("lodash")),u={"default":function(e,r){return e.html(r)},INPUT:function(e,r){var t=e.prop("type");return("checkbox"===t||"radio"===t)&&(r=n.isArray(r)?r:[r]),e.val(r)},SELECT:function(e,r){return e.val(r)},IMG:function(e,r){return e.prop("src",r).trigger("change",r)},TEXTAREA:function(e,r){return e.val(r)}};t.exports=function(e){var r=e.prop("tagName"),t=u[r]||u["default"];return function(r){return t(e,r)}}}}),define("__jquery.filler/single",["require","exports","module","jquery","lodash","./helpers","./attribute","./element"],function(e,r,t){{var n=e("jquery"),u=e("lodash"),i=e("./helpers"),l=e("./attribute"),o=e("./element");t.exports=function a(e,r){if(1===arguments.length&&u.isString(e)&&(r=e,e=n(window)),u.isArray(r)){var t=u.map(r,u.partial(a,e));return function(e){u.each(t,function(r){r(e)})}}r=i.splitInto(r,"->","element->attribute");var s=r.element?e.find(r.element):e;return r.attribute?l(s,r.attribute):o(s)}}}),define("jquery.filler",["require","exports","module","jquery","lodash","./__jquery.filler/single"],function(e,r,t){var n=e("jquery"),u=e("lodash"),i=e("./__jquery.filler/single"),l=t.exports=function(e,r){1===arguments.length&&(r=e,e=this);var t={};return u.each(r,function(r,n){t[n]=i(e,r)}),function(e){u.each(e,function(e,r){t[r](e)})}};n.prototype.filler=l});