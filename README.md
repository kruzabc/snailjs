# snailjs
an  asyn loading tool for html

# usage
```` javascript
<script src="snail.js"></script>
 <script type="text/javascript">
     snail.js('jquery','cookie','fastclick',function () {
         alert('load success:');
     });
 </script>
````
#note
this js file can be used on mobile(ios and android) but not support those browsers which does not support 'async' attr in script 