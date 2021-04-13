CHANGELOG
=========

v0.11.6 - 06/05/15
* Speed improvements
* Convert processor arrays to internal 16-bit buffers

v0.11.5 - 05/29/15
* Various Bug-fixes for encoder and decoder
* Encoder and decoder is stable - not anymore experimental

v0.11.4 - 05/23/15
* Add simple url support for readImage
* Refactor decoder - fully dynamic
* Complete encoder - also fully dynamic
* Add support for custom chunks including JSON chunk
* Add instrumentation for require

v0.11.3 - 05/23/15

v0.11.2 - 04/21/15
* Bugfix for decoder: filter-revert from previous-line

v0.11.1 - 04/20/15
* Add rotateCW/rotateCCW methods
* Add experimental feature
  * Add synchronous PNG loader (readImageSync)

v0.11.0 - 04/19/15
* Add experimental features:
  * Add PNG decoder supporting true-color (+alpha) and index-color (with palette); supports auxiliary chunk tRNS
  * Add PNG encoder - currently saving always in true-color with alpha-channel
  * Add synchronous PNG loader (loadImageSync)
  * Add synchronous PNG writer (writeFileSync)
  * Add synchronous PNG dump (toBlobSync)

v0.10.0 - 03/28/15
* General cleanup
* Add support for Node 0.12
* Add support for IO.js

v0.9.3 - Initial release 11/04/14
