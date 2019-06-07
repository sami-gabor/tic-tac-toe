// C:\Users\samoila.gabor\Documents\tic-tac-toe> node
// > const crypto = require('crypto');
// undefined
// > const secret = 'abc';
// undefined
// > crypto.createHmac('sha256', secret)
// Hmac {
//   _handle: {},
//   _options: undefined,
//   writable: true,
//   readable: true,
//   [Symbol(kState)]: { [Symbol(kFinalized)]: false } }
// > crypto.createHmac('sha256', secret).toString()
// '[object Object]'
// > crypto.createHmac('sha256', secret).digest('hex')
// 'e2636077506729a8f61aff2441332e40e844a8ad44489efd80210ea6d1f51088'
// > crypto.createHmac('sha256', secret).digest('hex')
// 'e2636077506729a8f61aff2441332e40e844a8ad44489efd80210ea6d1f51088'
// > crypto.createHmac('sha256', secret).digest('hex')
// 'e2636077506729a8f61aff2441332e40e844a8ad44489efd80210ea6d1f51088'
// > crypto.createHmac('sha256', secret).digest('hex')
// 'e2636077506729a8f61aff2441332e40e844a8ad44489efd80210ea6d1f51088'
// > const key = crypto.pbkdf2Sync('test1234', secret, 100000, 64, 'sha512').toString('hex');
// undefined
// > const key = crypto.pbkdf2Sync('test1234', secret, 100000, 64, 'sha512');
// Thrown:
// SyntaxError: Identifier 'key' has already been declared
// > let key2 = crypto.pbkdf2Sync('test1234', secret, 100000, 64, 'sha512');
// undefined
// > key2.toString('hex');
// '2f6d18ce9fe238fac3359b013e07a10449ad7ffb668221bc42203bf5183f450920f408f0859b3e404be745769bd85e7f846c0ca29295f7baf3077c88067961d6'
// > key2 = crypto.pbkdf2Sync('test1234', secret, 100000, 64, 'sha256');
// <Buffer c4 01 30 c9 bc cd ae 0b 93 b2 a8 5a fc 1c 03 18 c5 17 f7 3d ae 5e 73 24 c3 38 a8 8f 74 28 8c c4 33 ba 43 93 a9 3d f9 dd 85 83 14 68 16 25 95 ed 32 bf ... >
// > key2 = crypto.pbkdf2Sync('test1234', secret, 100000, 256, 'sha256');
// <Buffer c4 01 30 c9 bc cd ae 0b 93 b2 a8 5a fc 1c 03 18 c5 17 f7 3d ae 5e 73 24 c3 38 a8 8f 74 28 8c c4 33 ba 43 93 a9 3d f9 dd 85 83 14 68 16 25 95 ed 32 bf ... >
// > key2.toString('hex');
// 'c40130c9bccdae0b93b2a85afc1c0318c517f73dae5e7324c338a88f74288cc433ba4393a93df9dd85831468162595ed32bf7a5c33032433e47ca505178fa24f03f2833f3696ecf223e20afdf0474dff8a56c63f0b86cddc20e45ad1afc898b54675129081d19b709a88b7355070339186e1b54104ecdf42e5ef746fc800c169b9f437d8650180b14e449823d0d3338b47d3c2acdba49d7d40f3f8c16a6f03845fa9ee2cda481dad5fef3835165da079fb38e64942fe74fcfca4b641b97845f53f6a09c8f906aa599d3e4d33f898c3948a3e143c98aee10ff25fd07aa49c2e8a28446b0c734d815d504306add82905dee9931a2968d87a9a362e14ba191204d2'
// > key2 = crypto.pbkdf2Sync('test1234', secret, 100000, 128, 'sha256');
// <Buffer c4 01 30 c9 bc cd ae 0b 93 b2 a8 5a fc 1c 03 18 c5 17 f7 3d ae 5e 73 24 c3 38 a8 8f 74 28 8c c4 33 ba 43 93 a9 3d f9 dd 85 83 14 68 16 25 95 ed 32 bf ... >
// > key2.toString('hex');
// 'c40130c9bccdae0b93b2a85afc1c0318c517f73dae5e7324c338a88f74288cc433ba4393a93df9dd85831468162595ed32bf7a5c33032433e47ca505178fa24f03f2833f3696ecf223e20afdf0474dff8a56c63f0b86cddc20e45ad1afc898b54675129081d19b709a88b7355070339186e1b54104ecdf42e5ef746fc800c169'
// > key2 = crypto.pbkdf2Sync('test1234', secret, 100000, 128, 'sha256');
// > crypto.createHash('sha256').digest('hex')
// 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
// > crypto.createHash('sha256').digest('hex')
// 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
// > crypto.createHash('sha256').digest('hex')
// 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
// >
// > crypto.createHash('sha256').digest('hex')
// 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
// > crypto.randomBytes(256, (err, buf) => {
// ...   if (err) throw err;
// ...   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
// ... });
// undefined
// > 256 bytes of random data: c82857ab6035547c707c9eb75d2f576c4b46c4ef98387738bf7b261513d2e9b87800276ba60dfee15dcf770aa014be444ad6a246946810587fad95bf354be1e35b7bdbe39af68fb4b7c70016cc8140411f78f74e892389e0d980ecd49e211fb59dd303bc19e134723f9e8465de91fe41c0f640ae4631d4b55ab0f6eeab18410f976b407b800238cbe00e659fcd4ba05e756dd68181ea2c5439d9453c21a331bdc5da59a0d41359cd88eb1b354ebcfc7722b3dcf3bbc534b61f0bd4bd07354cb13dbbf8abdea0a99605040f546eaa15462db92fcee18f783203f63eb7cf43d1c45d4e708ec725685a156b1d878ac458d795b50109ae16ef4db4686ef54d38416e
// > crypto.randomBytes(256, (err, buf) => {
// ...   if (err) throw err;
// ...   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
// ... });
// undefined
// > 256 bytes of random data: 22a6033abbb97814ec4f922539b791dc9b0b493fe9e597415d32a130a90ca9dd9d919ddb7b4df642cf329620a23d7f85b0bc75515527fec444ae977bb5504d818af0c35f10499a5dccf5cec3830e8f8ac10ce8ea75ddcba45003ad327bcab13c590b366a2528fc532ea7234567a118413a48fb1436a78a7df49f5ec17d1ac2bd49fe580ceefbc078ac9c2f2235b05b0507e5a42be5c674db1171c24f7d922b36447803dc64fe37c65be3f275f715f308d2939571e905b73eff7e2ffe7902536488e407cc2b10f41ce6cf87b51231f14219433b814316be6565f680dde4f0d94ce3b86f3d6da96627e2bfc9def2381c2ecb83fae06fd8d81c82f4a9cbe00658ba
// >   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
// Thrown:
// ReferenceError: buf is not defined
// > crypto.createHmac('sha256', secret)
// Hmac {
//   _handle: {},
//   _options: undefined,
//   writable: true,
//   readable: true,
//   [Symbol(kState)]: { [Symbol(kFinalized)]: false } }
// > crypto.createHmac('sha256', secret)
// Hmac {
//   _handle: {},
//   _options: undefined,
//   writable: true,
//   readable: true,
//   [Symbol(kState)]: { [Symbol(kFinalized)]: false } }
// > crypto.createHmac('sha256', secret).digest('hex')
// 'e2636077506729a8f61aff2441332e40e844a8ad44489efd80210ea6d1f51088'
// > crypto.createHmac('sha256').digest('hex')
// Thrown:
// TypeError [ERR_INVALID_ARG_TYPE]: The "key" argument must be one of type string, TypedArray, or DataView. Received type undefined
//     at new Hmac (internal/crypto/hash.js:88:11)
//     at Object.createHmac (crypto.js:133:10)
// > crypto.randomBytes();
// Thrown:
// TypeError [ERR_INVALID_ARG_TYPE]: The "size" argument must be of type number. Received type undefined
//     at validateNumber (internal/validators.js:130:11)
//     at assertSize (internal/crypto/random.js:30:3)
//     at Object.randomBytes (internal/crypto/random.js:46:10)
// > crypto.randomBytes('a');
// Thrown:
// TypeError [ERR_INVALID_ARG_TYPE]: The "size" argument must be of type number. Received type string
//     at validateNumber (internal/validators.js:130:11)
//     at assertSize (internal/crypto/random.js:30:3)
//     at Object.randomBytes (internal/crypto/random.js:46:10)
// > crypto.randomBytes()
// Thrown:
// TypeError [ERR_INVALID_ARG_TYPE]: The "size" argument must be of type number. Received type undefined
//     at validateNumber (internal/validators.js:130:11)
//     at assertSize (internal/crypto/random.js:30:3)
//     at Object.randomBytes (internal/crypto/random.js:46:10)
// > crypto.randomBytes(1)
// <Buffer 82>
// > crypto.randomBytes(1).toString();
// 'o'
// > crypto.randomBytes(100).toString();
// '�� \b\'�\u001d�D\r�\u0001r�\u0011���,���%\u0019��J�Dx�\b<�\u00065�\'&��!�,ʖbX����57(1Yk�c��lA;�Y\u0017��M:z��"��9>�\u0001(G��\u0006<���tB'
// > crypto.randomBytes(256).toString();
// 'U�[����[Ҳd�ss�^\u0006���1|����_����@\u001a��h��~P|6\u0015���I\u001d�n͔9��v\\�X�c\u0019R��r�5��nI\n"ξ�e\\�{%�b�2�9�HI�/9H�\u0019�8�F/\u000b����k�\u0016���\fu�5I�##��T�t\u001d�̫\u001dzM���.��l���z\u001fW��p���$�\u000f\u0018\\s\tK��^
// �!�-�G�xf�#�����*�D�)}J�O:�m/���$�R\r�����\u001f[)9���*�CJ��⚾�-��c8Kh\u001a�=1K=�(�\u00026n?\u0019=h)�j�'
// > crypto.randomBytes(2).toString();
// 'Қ'
// > crypto.randomBytes(3).toString();
// '��{'
// > crypto.randomBytes(4).toString();
// '#\u0000� '
// > crypto.randomBytes(5).toString();
// 'P�Q"\u0010'
// > crypto.randomBytes(256, (err, buf) => {
// ... ...   if (err) throw err;
// Thrown:
// ...   if (err) throw err;
//       ^^

// SyntaxError: Unexpected token if
// > ...   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
// Thrown:
// ...   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
// ^^^

// SyntaxError: Unexpected token ...
// > ... });
// Thrown:
// ... });
//     ^

// SyntaxError: Unexpected token }
// > crypto.pbkdf2Sync('test1234', secret, 100000, 64, 'sha512').toString('hex');
// '2f6d18ce9fe238fac3359b013e07a10449ad7ffb668221bc42203bf5183f450920f408f0859b3e404be745769bd85e7f846c0ca29295f7baf3077c88067961d6'
// > crypto.pbkdf2Sync('test1234', secret, 100000, 64, 'sha512').toString('hex');
// '2f6d18ce9fe238fac3359b013e07a10449ad7ffb668221bc42203bf5183f450920f408f0859b3e404be745769bd85e7f846c0ca29295f7baf3077c88067961d6'
// > crypto.pbkdf2Sync('test1234', 'test', 100000, 64, 'sha512').toString('hex');
// 'd4f927fb6916d24dae024d6191803486013d92f73a0560d326a7bd9cc0391bb2de47ca56d2e7ebef14d10312f494ac6d0e006bb647ec993eb640ccc383b7b2ea'
// >