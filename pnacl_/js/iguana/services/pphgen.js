
'use strict';

angular.module('iguanaApp.services').factory('pphgen', function() {
   var root = {};

   <!--    
   var prng;                        // Pseudorandom number generator
   var seed;                        // Current seed array

   //   setSeed  - -  Set seed from seed string
       
   function setSeed() {
     var s = encode_utf8(Generate_seed());
     var i, kmd5e, kmd5o;

     if (s.length == 1) {
      s += s;
     }

     md5_init();
     for (i = 0; i < s.length; i += 2) {
      md5_update(s.charCodeAt(i));
     }
     md5_finish();
     kmd5e = byteArrayToHex(digestBits);

     md5_init();
     for (i = 1; i < s.length; i += 2) {
      md5_update(s.charCodeAt(i));
     }
     md5_finish();
     kmd5o = byteArrayToHex(digestBits);

     var hs = kmd5e + kmd5o;
     seed =  hexToByteArray(hs);
   }
               
   /*   Determine number of words from current dictionary equivalent to
     requested number of bits in key.  */

   function bitsWord() {
     var b = 32;
     var n;
     for (n = 1; b > Math.floor(Math.LOG2E * Math.log(twords) * n); n++) ;
     
     return n;
   }

   // Retrieve word given index in list of words of that length

   function retrieveWord(length, index) {
     if ((length >= minw) && (length <= maxw) && (index >= 0) && (index < nwords[length])) {
       return cwords[length].substring(length * index, length * (index + 1));
     }
     
     return "";
   }
       
   // Obtain word by index in complete dictionary

   function indexWord(index) {
     if ((index >= 0) && (index < twords)) {
       var j;

       for (j = minw; j <= maxw; j++) {
         if (index < nwords[j]) {
           break;
         }
         index -= nwords[j];
       }
       
       return retrieveWord(j, index);
     }

     return "";
   }
       
   // Generate pass phrases    
   root.GeneratePassPhrase = function() {
     var i, j, w, k, sign=false, sig = "";
      
     // Update number of bits equivalent to phrase words requested
      
      setSeed();
      prng = new AESprng(seed);

      var k = "", nw = 0;
      while (nw < 12) {
         if (k.length > 0) {
             k += " ";
         }
         
         k += indexWord(prng.nextInt(twords));
         nw++;
      }
      
      /*   If we're including MD5 signatures of the phrases, compute
        the signature of this phrase and append to the list we'll
     tack on to the end of the signature table.  */
     
     if (sign) {
       md5_init();
       
       for (j = 0; j < k.length; j++) {
         md5_update(k.charCodeAt(j));
       }
       
       md5_finish();
       
       var n, hex = "0123456789ABCDEF";

       for (n = 0; n < 16; n++) {
         sig += hex.charAt(digestBits[n] >> 4);
         sig += hex.charAt(digestBits[n] & 0xF);
       }
       
       sig += "\n";
     }
      
     k += sig;
     // delete prng;

     return k;
   }
      
   // Generate a pseudorandom seed value
   function Generate_seed() {
     var i, j, k = "";

     addEntropyTime();
     var seed = keyFromEntropy();

     var prng = new AESprng(seed);
     // Text key
     var charA = ("A").charCodeAt(0);
      
     for (i = 0; i < 12; i++) {
       if (i > 0) {
         k += "-";
       }
       for (j = 0; j < 5; j++) {
         k += String.fromCharCode(charA + prng.nextInt(25));
       }
     }

     // delete prng;
     
     return k;
   }

   return root;

   // -->
});