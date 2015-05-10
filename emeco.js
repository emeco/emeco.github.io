// エディタの設定
(function() { "use strict";
  // それぞれのtextareaをエディタにする ===============================
  // textareaを取る
  var htmlArea = document.querySelector( ".text.html" );
  var cssArea  = document.querySelector( ".text.css" );
  var jsArea   = document.querySelector( ".text.js" );

  // 何回も打ちたくないからkeymapの変数を用意
  var extrakey = {
    "Ctrl-T": function() {
      moveNextTab();
    },
    "Ctrl-R": function() {
      $( "#jsButton" ).click();
    },
    "Ctrl-S": function() {
      saveFile();
    }
  };

  var htmlKey = Object.create( extrakey );
  var cssKey = Object.create( extrakey );
  var jsKey = Object.create( extrakey );

  htmlKey["Ctrl-Y"] = "htmlcomplete";
  cssKey["Ctrl-Y"]  = "csscomplete";
  jsKey["Ctrl-Y"]   = "jscomplete";

  var htmlEditor = CodeMirror(function( elt ) {
    htmlArea.parentNode.replaceChild( elt, htmlArea );
  }, {
    mode: "htmlmixed",
    theme: "tomorrow-night-eighties",
    vimMode: true,
    showCursorWhenSelecting: true,
    lineNumbers: true,
    autofocus: true,
    extraKeys: htmlKey,
    cursorBlinkRate: 0,
    profile: "xhtml"
  });

  var cssEditor = CodeMirror(function( elt ) {
    cssArea.parentNode.replaceChild( elt, cssArea );
  }, {
    mode: "css",
    theme: "tomorrow-night-eighties",
    vimMode: true,
    showCursorWhenSelecting: true,
    extraKeys: cssKey,
    lineNumbers: true,
    cursorBlinkRate: 0
  });

  var jsEditor = CodeMirror(function( elt ) {
    jsArea.parentNode.replaceChild( elt, jsArea );
  }, {
    mode: "javascript",
    theme: "tomorrow-night-eighties",
    vimMode: true,
    showCursorWhenSelecting: true,
    extraKeys: jsKey,
    lineNumbers: true,
    cursorBlinkRate: 0
  });

  // エディタを配列に格納
  var editors = [ htmlEditor, cssEditor, jsEditor ];
  var editorNames = [ "HTML", "CSS", "JavaScript" ];

  // エディタサイズ変更
  $.each(editors, function(i) {
    editors[i].setSize( 510, 510 );
  });

  // 保存フラグ
  var saveFlag = true

  // 初期値にHello, Emecoを設定
  // $(function() {
  //   htmlEditor.setValue( "<h1>Hello, Emeco!!</h1>" );
  // });
  // =================================================================


  // ============================================================
  // containsメソッド
  String.prototype.contains = function( str ) {
    return this.match( str ) !== null;
  };

  // 改行を消す
  String.prototype.eraseCR = function() {
    return this.replace( /\n/g, "" );
  };

  // エディタの中身を返す
  var editorContents = function( editor ) {
    return editor.doc.getValue();
  };

  // エディタに引数を書き込む
  var writeEditor = function( editor, str ) {
    editor.doc.setValue( str );
  };

  // activeなインデックスを取得
  var getActive = function() {
    var allTab = $( ".editorTab" );
    var activeTab = $( "li.active" );

    return allTab.index( activeTab );
  };

  // 次のタブに移動
  var moveNextTab = function() {
    var editorTab = $( ".editorTab" );
    var div = $( "div.tab-pane" );
    var activeTab = $( "li.active" );
    var activeDiv = $( "div.active" );
    var nextTab = getActive() + 1;
    var nextDiv = div.index( activeDiv ) + 1;
    nextTab = nextTab > 2 ? 0 : nextTab;
    nextDiv = nextDiv > 2 ? 0 : nextDiv;
    activeTab.removeClass( "active" );
    activeDiv.removeClass( "active" );
    $(editorTab[nextTab]).addClass( "active" );
    $(div[nextDiv]).addClass( "active" );
    editors[nextTab].focus();
  };

  // ファイル保存
  var saveFile = function() {
    // アクティブのsaveボタンを取る
    var editorTab = $( ".editorTab" );
    var saveButtons = $( ".save" );
    var activeSave = saveButtons[editorTab.index( $( "li.active" ) )];

    saveFlag = true
    activeSave.click();
  };

  // 補完
  CodeMirror.commands.htmlcomplete = function( cm ) {
    CodeMirror.showHint( cm, CodeMirror.hint.html, {
      extraKeys: {
        "Ctrl-N": "Down"
      }
    });
  };

  CodeMirror.commands.csscomplete = function( cm ) {
    CodeMirror.showHint( cm, CodeMirror.hint.css, {
      extraKeys: {
        "Ctrl-N": "Down"
      }
    });
  };

  CodeMirror.commands.jscomplete = function( cm ) {
    CodeMirror.showHint( cm, CodeMirror.hint.javascript, {
      extraKeys: {
        "Ctrl-N": "Down"
      }
    });
  };

  // iframeを取る
  var emecoBrowser = document.querySelector( "#iframe" );

  // iframeのwidthをウィンドウの幅にする
  $( emecoBrowser ).css( "width", $( window ).width() * 0.85 + "px" );

  // iframeのwidthが常にウィンドウの幅になるようにする
  var timer = false;
  $( window ).on( "resize", function() {
    if ( timer !== false ) {
      clearTimeout( timer );
    }

    timer = setTimeout(function() {
      $( emecoBrowser ).css( "width", $( window ).width() * 0.87 + "px" );
    }, 200 );
  });

  // iframeのソースに初期値を設定
  var startSrc = '<!doctype html><html><head><link href="lib/bootstrap-3.0.0/dist/css/bootstrap.min.css" rel="stylesheet" media="screen"></head><body><style id="emecoCss"></style><script src="lib/jquery.js"></script><script src="lib/bootstrap-3.0.0/dist/js/bootstrap.min.js"></script><script id="emecoJs"></script></body></html>';
  var emecoBrowserSrc = startSrc;


  // htmlの変数
  var openCss = '<style id="emecoCss">';
  var closeCss = '</style>';
  var openJs = '<script id="emecoJs">';
  var closeJs = '</script>';
  var doctype = "<!doctype html>";
  var openHead = "<head>";
  var closeHead = "</head>";
  var openBody = "<body>";
  var closeBody = "</body>";
  var srcjquery = '<script src="lib/jquery.js"></script>';
  var srcbootstrapCss = '<link href="lib/bootstrap-3.0.0/dist/css/bootstrap.min.css" rel="stylesheet" media="screen">';
  var srcbootstrapJs = '<script src="lib/bootstrap-3.0.0/dist/js/bootstrap.min.js"></script>';

  // イベントを止める
  var stopEvent = function( e ) {
    e.preventDefault();
  };

  // =================================================================


  // ファイル読み込み ================================================
  var file = $( ".file" );
  var fileButtons = $( ".fileButton" );

  $.each( fileButtons, function( i ) {
    fileButtons[i].addEventListener( "click", function(){
      var evt = document.createEvent( "MouseEvents" );
      evt.initEvent( "click", false, true );
      file[i].dispatchEvent( evt );
    }, false );
  });

  $.each(file, function( i ) {
    file[i].addEventListener( "change", function( e ) {
      var reader = new FileReader();
      var f = file[i].files.item( 0 );
      reader.readAsText( f, "UTF-8" );

      reader.addEventListener( "load", function() {
        writeEditor( editors[i], reader.result );
      }, false );
    }, false );
  });

  // =================================================================


  // ファイル書き込み ================================================
  var saveButtons = $( ".save" );
  var modals = [ "#htmlFileName", "#cssFileName", "#jsFileName" ];
  var extensions = [ ".html", ".css", ".js" ];
  var okButtons = [ "#htmlOK", "#cssOK", "#jsOK" ];
  var cancelButtons = $( ".cancelButton" );
  var modalBody = [ "#saveHtml", "#saveCss", "#saveJs" ];

  $.each( modals, function(i) {
    // saveボタンを押したらフォーカスが入力するところに当たる
    $( saveButtons[i] ).on( "click", function() {
      setTimeout( function(){
        $( modals[i] ).focus();
      }, 400);
    });

    // ダイアログにダウンロードイベント追加
    $( okButtons[i] ).on( "click", function( e ) {
      var filename = $( modals[i] ).val();

      if ( filename ) {
        // エディタの中身を取る
        var editorSrc = editorContents( editors[i] );

        // 拡張子が入ってなかったら補う
        if ( !filename.contains( extensions[i] ) ) {
          filename += extensions[i];
        }

        // URL生成
        var blob = new Blob( [editorSrc], { type: 'text/plain' } );
        var fileURL = URL.createObjectURL( blob );

        // ダウンロードリンクを生成
        var downloadLink = $( "<a>" ).attr({
          href: fileURL,
          download: filename
        }).text( filename )[0];

        // 擬似的にクリックする
        var evt = document.createEvent( "MouseEvents" );
        evt.initEvent( "click", false, true );
        downloadLink.dispatchEvent( evt );
      }
      else {
        alert( "ファイル名を入力してください。" );
        e.stopImmediatePropagation();
        $( modals[i] ).focus();
      }
    });

    // enterを押したら保存
    $( modals[i] ).on( "keydown", function( e ) {
      if ( e.keyCode === 13 ) {
        $( okButtons[i] ).click();
      }
    });

    // モーダルが消えたらエディタにフォーカスを返す
    $( modalBody[i] ).on( "hide.bs.modal", function() {
      editors[getActive()].focus();
    });

  });

  // =================================================================


  // 即時反映 ========================================================

  // TODO: cssとjsがローカルファイルを参照してるときに、ターミナルから
  //       カレントディレクトリのファイルを開けた時しかうまく引っ張って
  //       これないことがわかった。
  //       ユーザー名を引っ張ってきて、localhostからの絶対パスを入れれば
  //       いけるかも

  // htmlはiframeのソースへ
  htmlEditor.on( "change", function() {
    var htmlSrc = editorContents( htmlEditor ).eraseCR();

    // doctypeとhtmlタグを書いてあったらもう入ってるから消す
    htmlSrc.replace( /<!doctype html>/, "" );
    htmlSrc.replace( /<html>/, "");
    htmlSrc.replace( /<\/html>/, "");

    // headの中身をエディタに書いてあったら書き換える
    if (htmlSrc.match( /<head>/ ) && htmlSrc.match( /<\/head>/ ) ) {
      var editorHead = htmlSrc.match( /<head>.*<\/head>/ );
      emecoBrowserSrc = emecoBrowserSrc.replace( /<head>.*<\/head>/, editorHead );
      emecoBrowserSrc = emecoBrowserSrc.replace( /<\/head>/, srcbootstrapCss + closeHead );
      htmlSrc = htmlSrc.replace( /<head>.*<\/head>/, "" );
    }

    // bodyは基本書き換える
    var editorBody;
    var cssSrc = emecoBrowserSrc.match( /<style id="emecoCss">.*<\/style>/ )[0];
    var jsSrc = emecoBrowserSrc.match( /<script id="emecoJs">.*<\/script>/ )[0];

    // エディタにbodyタグが入ってたら中身を入れ替える
    if (htmlSrc.match( /<body>/ ) && htmlSrc.match( /<\/body>/ ) ) {
      editorBody = htmlSrc.match( /<body>.*<\/body>/ )[0];
      emecoBrowserSrc = emecoBrowserSrc.replace( /<body>.*<\/body>/, editorBody );
    }
    // そうじゃなければエディタの中身を全部bodyに入れる
    else {
      editorBody = openBody + htmlSrc + closeBody;
      emecoBrowserSrc = emecoBrowserSrc.replace( /<body>.*<\/body>/, editorBody );
    }

    // cssとjsを入れる
    var cssAndJs = cssSrc + srcjquery + srcbootstrapJs + jsSrc + closeBody;
    emecoBrowserSrc = emecoBrowserSrc.replace( /<\/body>/, cssAndJs );
    emecoBrowser.srcdoc = emecoBrowserSrc;
    saveFlag = false
  });

  // cssはheadへ
  // TODO iframeがheadを空にする問題を解決したい
  cssEditor.on( "change", function() {
    var editorCss = editorContents( cssEditor ).eraseCR();
    var cssSrc = openCss + editorCss + closeCss;

    emecoBrowserSrc = emecoBrowserSrc.replace( /<style id="emecoCss">.*<\/style>/, cssSrc);
    emecoBrowser.srcdoc = emecoBrowserSrc;
    saveFlag = false
  });

  $( "#jsButton" ).on( "click", function() {
     var editorJs = editorContents( jsEditor ).eraseCR();
     var jsSrc = openJs + editorJs + closeJs;

     emecoBrowserSrc = emecoBrowserSrc.replace( /<script id="emecoJs">.*<\/script>/, jsSrc );
     emecoBrowser.srcdoc = emecoBrowserSrc;
     saveFlag = false
  });

  // =================================================================

  // vimのモード切替をlightlineみたいに可視化する
  var insertMode = $( ".insertMode" );
  var visualMode = $( ".visualMode" );
  var nomalMode  = $( ".nomalMode" );
  var currentMode = nomalMode;

  var switchMode = function( index, previous, next ) {
    $(previous[index]).css( "display", "none" );
    $(next[index]).css( "display", "block" );
    return next;
  };

  $.each(editors, function( i ) {
    editors[i].on( "vim-mode-change", function() {

      if ( editors[i].state.vim.insertMode ) {
        currentMode = switchMode( i, currentMode, insertMode );
      }
      else if ( editors[i].state.vim.visualMode ) {
        currentMode = switchMode( i, currentMode, visualMode );
      }
      else {
        currentMode = switchMode( i, currentMode, nomalMode );
      }
    });
  });

  // TODO iframeにフォーカスを持って行かれたらエディタに取り返す====

  // ページを閉じようとしたら怒る ==================================
  $( window ).on( "beforeunload", function() {
    if (!saveFlag) {
      return "このまま行っちゃっていいすか？";
    }
  });
  // ===============================================================

  // ===============================================================
})();
