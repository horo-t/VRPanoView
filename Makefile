

.PHONY: all
all: out/js/vrpanoview.dbg.js out/js/vrpanoview.min.js out/js/vrpanoview.map.js

.PHONY: clean
clean:
	rm -rf out/js/*

JS_FILES := \
	src/js/mat4_util.js \
	src/js/pano_image.js \
	src/js/pano_info.js \
	src/js/pano_view.js

EXTERN_FILES := \
  src/externs/externs.js

out/js/vrpanoview.min.js out/js/vrpanoview.min.js.map: $(JS_FILES)
	java -jar third_party/closure-compiler/closure-compiler-v20180805.jar \
		--compilation_level ADVANCED \
		--externs $(EXTERN_FILES) \
		--js $(JS_FILES) \
		--js_output_file out/js/vrpanoview.min.js \
		--create_source_map out/js/vrpanoview.min.js.map \
		--source_map_include_content \
		--rewrite_polyfills false \
		--isolation_mode IIFE \
		-W VERBOSE

out/js/vrpanoview.map.js: out/js/vrpanoview.min.js
		cp out/js/vrpanoview.min.js out/js/vrpanoview.map.js && \
		echo '//@ sourceMappingURL=vrpanoview.min.js.map' \
		>> out/js/vrpanoview.map.js

out/js/vrpanoview.dbg.js: $(JS_FILES)
		cat $(JS_FILES) > out/js/vrpanoview.dbg.js