var gulp = require("gulp");
var connect = require("gulp-connect");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps")

gulp.task("connect", function() {
    connect.server({
        root: "dist",
        livereload: true
    });
});

gulp.task("sass", function() {
    //take these sass files from this location
    gulp.src("scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css"))
        .pipe(connect.reload());
});

gulp.task("watch", function() {
    gulp.watch("scss/*.scss", ["sass"]);
    gulp.watch("views/*.html", ["copy"]);
    gulp.watch("index.html", ["copy"]);
    gulp.watch("js/*.js", ["copy"]);
});

gulp.task("copy", function() {
    gulp.src("index.html")
        .pipe(gulp.dest("dist/"))
        .pipe(connect.reload());
    gulp.src("js/*")
        .pipe(gulp.dest("dist/js"))
        .pipe(connect.reload());
    gulp.src("views/*")
        .pipe(gulp.dest("dist/views"))
        .pipe(connect.reload());
    gulp.src("resources/*")
        .pipe(gulp.dest("dist/resources"))
        .pipe(connect.reload());
});

gulp.task("default", ["sass", "watch", "copy", "connect"]);
