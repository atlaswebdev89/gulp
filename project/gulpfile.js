var gulp = require('gulp');

var cssnano = require("gulp-cssnano"), // Минимизация CSS


    rename = require("gulp-rename"); // Переименование файлов

gulp.task('mytask', function() {
    console.log('Привет, я таск!');
});

// Копирование файлов HTML в папку dist
gulp.task("html", function() {
    return gulp.src("app/**/*.html")
        .pipe(gulp.dest("dist"));
});

//Минификация js


//Минификация CSS
// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("csso", function() {
    return gulp.src("app/css/**/*.css")
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/css"));
});

//Следить за изменениями в файлах
gulp.task('watch', function(){
    gulp.watch('app/**/*.html',  gulp.parallel('html'));
    gulp.watch("app/css/**/*.css",  gulp.parallel('csso'));
    // другие ресурсы
});

// Запуск тасков по умолчанию
gulp.task("default", gulp.parallel('html', "csso", 'watch'));