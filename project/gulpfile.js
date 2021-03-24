var gulp = require('gulp');

var cssnano = require("gulp-cssnano"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    rename = require("gulp-rename"), // Переименование файлов
    imagemin = require('gulp-imagemin'),// Сжатие изображение
    cache = require('gulp-cache'), //Кеширование изображений
    del    = require('del');//Подключаем библиотеку для удаления файлов и папок

// Копирование файлов HTML в папку dist
gulp.task("html", function() {
    return gulp.src("app/*.html")
        .pipe(gulp.dest("dist"));
});
//Копирование файлов js  из папки vendor
gulp.task("vendors", function () {
    return gulp.src ("app/vendor/**/*.+(css|js|png|gif)")
            .pipe (gulp.dest("dist/vendor/"))
});
//Копируем шрифты
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});
//Минификация и конкатенация CSS
gulp.task("csso", function() {
    return gulp.src("app/css/**/*.css")
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/css"));
});
// Объединение (конкатенация) и сжатие(минификация) JS-файлов
gulp.task("scripts", function() {
    return gulp.src("app/js/*.js") // директория откуда брать исходники
        .pipe(concat('main.js')) // объеденим все js-файлы в один 
        //.pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("dist/js")); // директория продакшена, т.е. куда сложить готовый файл
});
//Сжатие изображений
gulp.task("images", function() {
    return gulp.src("app/img/**/*.+(png|jpeg|jpg|svg|gif)")
            .pipe(cache(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true
            })))
            .pipe(gulp.dest("dist/img"))
});
//Следить за изменениями в файлах
gulp.task('watch', function(){
    gulp.watch('app/**/*.html',  gulp.parallel('html'));
    gulp.watch("app/css/**/*.css",  gulp.parallel('csso'));
    gulp.watch("app/js/**/*.js",  gulp.parallel('scripts'));
    gulp.watch("app/vendor/**/*",  gulp.parallel('vendors'));
    gulp.watch("app/img/**/*",  gulp.parallel('images'));
});
gulp.task("clean", function () {
   return del.sync('dist'); // Удаляем папку dist перед сборкой 
});
//Очистка кеша
gulp.task('clear', function (callback) {
	return cache.clearAll();
})
// Запуск тасков по умолчанию
gulp.task("default", gulp.parallel("html", "csso", "scripts", "images", "fonts", "vendors",  "watch"));
gulp.task("build", gulp.parallel("clean", "html", "csso", "scripts", "images", "fonts", "vendors"));