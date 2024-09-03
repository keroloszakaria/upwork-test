const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create(); // Import BrowserSync
const clean = require("gulp-clean"); // Import gulp-clean

// Define source and destination directories
const srcDir = "src/";
const destDir = "dist/";

// Pug (Jade) task to compile Pug files
function compilePug() {
  return gulp
    .src(srcDir + "src/views/*.pug")
    .pipe(pug())
    .pipe(gulp.dest(destDir));
}

// Sass task to compile SCSS files
function compileSass() {
  return gulp
    .src(srcDir + "styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(destDir + "css"));
}

// JavaScript task to minify JS files
function minifyJS() {
  return gulp
    .src(srcDir + "scripts/*.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(destDir + "js"));
}

function optimizeImages() {
  return gulp.src(srcDir + "images/*").pipe(gulp.dest(destDir + "images"));
}

// Define a task to initialize BrowserSync
function browserSyncInit() {
  browserSync.init({
    server: {
      baseDir: destDir, // Serve files from the 'dist' directory
    },
    port: 3000, // You can change the port if needed
  });
}

// Watch for changes in source files and trigger BrowserSync
function watch() {
  // Initialize BrowserSync
  browserSyncInit();

  gulp.watch([srcDir + "src/views/*.pug", srcDir + "src/**/*.pug"], compilePug);
  gulp.watch(
    [srcDir + "styles/**/*.scss", srcDir + "styles/*.scss"],
    compileSass
  );
  gulp.watch(srcDir + "scripts/*.js", minifyJS);
  gulp.watch(srcDir + "images/*", optimizeImages);

  // Reload the browser when changes are detected
  gulp.watch(destDir + "**/*").on("change", browserSync.reload);
}

// Define the default task with BrowserSync
gulp.task(
  "default",
  gulp.series(
    // cleanDist,
    compilePug,
    compileSass,
    minifyJS,
    optimizeImages,
    watch
  )
);
