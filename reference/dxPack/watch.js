/**
 * chokidar.watch(paths, [options])

paths（字符串或字符串数组）。文件的路径，递归观察的显示目录或水珠模式。
options （对象）选项对象定义如下：
坚持
persistent（默认:) true。指示只要正在监视文件，进程是否应继续运行。如果设置为 false使用fsevents观看时ready，即使进程继续运行，也不会再发出任何事件。
路径过滤
ignored（anymatch -compatible definition）定义要忽略的文件/路径。测试整个相对或绝对路径，而不仅仅是文件名。如果提供了具有两个参数的函数，则每个路径调用两次 - 一次使用单个参数（路径），第二次使用两个参数（路径和该路径的 fs.Stats 对象）。
ignoreInitial（默认:) false。如果设置为falsethen add/ / addDir也会在实例化观看时发出匹配路径的事件，因为chokidar会发现这些文件路径（在ready事件之前）。
followSymlinks（默认:) true。何时false，只会观察符号链接本身的更改，而不是通过链接的路径跟踪链接引用和冒泡事件。
cwd（没有默认值）。要从中paths派生监视的基本目录。与事件一起发出的路径将与此相关。
disableGlobbing（默认:) false。如果设置为true，则字符串传递到.watch()和.add()被视为字面路径名，即使它们看起来像水珠。
性能
usePolling（默认:) false。是否使用fs.watchFile（由轮询支持）或fs.watch。如果轮询导致CPU利用率过高，请考虑将其设置为false。通常需要将其设置为true通过网络成功查看文件，并且可能需要在其他非标准情况下成功查看文件。true在MacOS 上显式设置会覆盖 useFsEvents默认值。您还可以将CHOKIDAR_USEPOLLING env变量设置为true（1）或false（0）以覆盖此选项。
轮询特定设置（有效时usePolling: true）
interval（默认:) 100。文件系统轮询的间隔。您还可以设置CHOKIDAR_INTERVAL env变量来覆盖此选项。
binaryInterval（默认:) 300。文件系统轮询二进制文件的间隔。（参见二进制扩展列表）
useFsEvents（默认：true在MacOS上）。是否使用 fsevents观看界面（如果可用）。如果设置为true显式且fsevents可用，则取代usePolling设置。false在MacOS上设置为时，usePolling: true将成为默认设置。
alwaysStat（默认:) false。如果依赖于fs.Stats 可能与add，addDir和change事件一起传递的 对象，则将其设置true为确保即使在基础监视事件中尚未提供它的情况下也提供它。
depth（默认:) undefined。如果设置，则限制将遍历多少级别的子目录。
awaitWriteFinish（默认:) false。默认情况下，在add写入整个文件之前，文件首次出现在磁盘上时将触发该事件。此外，在某些情况下，在change 写入文件时会发出一些事件。在某些情况下，尤其是在查看大文件时，需要等待写操作完成，然后才能响应文件创建或修改。设置awaitWriteFinish为true（或truthy值）将轮询文件大小，保持其add和change事件，直到大小在可配置的时间内没有更改。适当的持续时间设置在很大程度上取决于操作系统和硬件。为了准确检测，此参数应该相对较高，使文件观察响应性降低。谨慎使用。
options.awaitWriteFinish 可以设置为一个对象，以调整时间参数：
awaitWriteFinish.stabilityThreshold（默认值：2000）。文件大小在发出事件之前保持不变的时间量（以毫秒为单位）。
awaitWriteFinish.pollInterval（默认值：100）。文件大小轮询间隔。

 * 方法与事件
chokidar.watch()生成一个实例FSWatcher。方法FSWatcher：

.add(path / paths)：添加文件，目录或glob模式以进行跟踪。获取字符串数组或仅使用一个字符串。
.on(event, callback)：听一个FS事件。可用事件：add，addDir，change，unlink，unlinkDir，ready， raw，error。另外all是获取与标的事件名称和路径发出比其他每一个事件提供ready，raw和error。
.unwatch(path / paths)：停止观看文件，目录或glob模式。获取字符串数组或仅使用一个字符串。
.close()：从监视文件中删除所有侦听器。
.getWatched()：返回表示此FSWatcher实例正在监视的文件系统上的所有路径的对象。对象的键是所有目录（使用绝对路径，除非使用该cwd选项），并且值是每个目录中包含的项的名称的数组。 */
const chokidar = require("chokidar"); // 文件观察
const path = require("path");

// 按 key 存，值为数组
const watchers = {};

function toAbsolute(p) {
  if (isAbsolute(p)) {
    return p;
  }
  return join(process.cwd(), p);
}

export function watch(key, files) {
  if (process.env.WATCH_FILES === "none") return;
  if (!watchers[key]) {
    watchers[key] = [];
  }
  const { APP_ROOT } = process.env;
  const watcher = chokidar.watch(files, {
    ignoreInitial: true,
    cwd: APP_ROOT ? toAbsolute(APP_ROOT) : process.cwd()
  });
  watchers[key].push(watcher);
  return watcher;
}

export function unwatch(key) {
  if (!key) {
    return Object.keys(watchers).forEach(unwatch);
  }
  if (watchers[key]) {
    watchers[key].forEach(watcher => {
      watcher.close();
    });
  }
}
