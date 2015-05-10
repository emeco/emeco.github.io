// エディタの設定
( function() { "use strict";
  // それぞれのtextareaをエディタにする ===============================
  // textareaを取る
  var htmlArea = document.querySelector( ".text.html" );
  var cssArea  = document.querySelector( ".text.css" );
  var coffeeArea = document.querySelector( ".text.coffee" );

  // 何回も打ちたくないからkeymapの変数を用意
  var extrakey = {
    "Ctrl-T": function() {
      moveNextTab();
    },
    "Ctrl-R": function() {
      $( "#coffeeButton" ).click();
    },
    "Ctrl-S": function() {
      saveFile();
    }
  };

  // keymapの変数を継承したオブジェクト
  var htmlKey = Object.create( extrakey );
  var cssKey = Object.create( extrakey );
  var coffeeKey = Object.create( extrakey );

  // 補完をセット
  htmlKey[ "Ctrl-Y" ] = "htmlcomplete";
  cssKey[ "Ctrl-Y" ]  = "csscomplete";
  coffeeKey[ "Ctrl-Y" ] = "jscomplete";

  // CodeMirrorを各言語ごとにセット
  // html
  var htmlEditor = CodeMirror(function( elt ) {
    htmlArea.parentNode.replaceChild( elt, htmlArea );
  }, {
    mode: "htmlmixed",
    theme: "solarized light",
    vimMode: true,
    showCursorWhenSelecting: true,
    lineNumbers: true,
    autofocus: true,
    extraKeys: htmlKey,
    cursorBlinkRate: 0,
    profile: "xhtml"
  });

  // css
  var cssEditor = CodeMirror(function( elt ) {
    cssArea.parentNode.replaceChild( elt, cssArea );
  }, {
    mode: "css",
    theme: "solarized light",
    vimMode: true,
    showCursorWhenSelecting: true,
    extraKeys: cssKey,
    lineNumbers: true,
    cursorBlinkRate: 0
  });

  // coffee
  var coffeeEditor = CodeMirror( function( elt ) {
    coffeeArea.parentNode.replaceChild( elt, coffeeArea );
  }, {
    mode: "coffeescript",
    theme: "solarized light",
    vimMode: true,
    showCursorWhenSelecting: true,
    extraKeys: coffeeKey,
    lineNumbers: true,
    cursorBlinkRate: 0
  });

  // エディタを配列に格納
  var editors = [ htmlEditor, cssEditor, coffeeEditor ];
  var editorNames = [ "HTML", "CSS", "CoffeeScript" ];

  // 保存フラグ
  var saveFlag = true

  // エディタサイズ変更
  $.each(editors, function( i ) {
    editors[ i ].setSize( 510, 510 );
  });

  // 初期値にHello, Emecoを設定
  // なくそう
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
    // 必要なDOMを取得
    var editorTab = $( ".editorTab" );
    var div = $( "div.tab-pane" );
    var activeTab = $( "li.active" );
    var activeDiv = $( "div.active" );

    // 次のタブとDivを取得
    var nextTab = getActive() + 1;
    var nextDiv = div.index( activeDiv ) + 1;

    // 右端から左端にワープできるように
    nextTab = nextTab > editors.length - 1 ? 0 : nextTab;
    nextDiv = nextDiv > editors.length - 1 ? 0 : nextDiv;

    // アクティブなエディタを切り替える
    activeTab.removeClass( "active" );
    activeDiv.removeClass( "active" );
    $(editorTab[nextTab]).addClass( "active" );
    $(div[nextDiv]).addClass( "active" );

    // 切り替えたら、フォーカスを当てる
    editors[ nextTab ].focus();
  };

  // ファイル保存
  var saveFile = function() {
    // アクティブのsaveボタンを取る
    var editorTab = $( ".editorTab" );
    var saveButtons = $( ".save" );
    var activeSave = saveButtons[ editorTab.index( $( "li.active" ) )];

    activeSave.click();
    saveFlag = true
  };

  // 補完
  // C-Nで補完候補を移動できるように
  var completeExtraKey = {
    "Ctrl-N": "Down",
  };

  CodeMirror.commands.htmlcomplete = function( cm ) {
    CodeMirror.showHint( cm, CodeMirror.hint.html, {
      extraKeys: completeExtraKey
    });
  };

  CodeMirror.commands.csscomplete = function( cm ) {
    CodeMirror.showHint( cm, CodeMirror.hint.css, {
      extraKeys: completeExtraKey
    });
  };

  CodeMirror.commands.jscomplete = function( cm ) {
    CodeMirror.showHint( cm, CodeMirror.hint.javascript, {
      extraKeys: completeExtraKey
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

  // htmlの変数
  var openCss = '<style id="emecoCss">\n';
  var closeCss = '\n</style>\n';
  var openCoffee = '<script type="text/coffeescript" id="emecoCoffee">\n';
  var closeCoffee = '\n</script>\n';
  var doctype = "<!doctype html>\n";
  var openHead = "<head>\n";
  var closeHead = "\n</head>";
  var openBody = "<body>\n";
  var closeBody = "\n</body>\n";
  var srcjquery = '<script src="lib/jquery.js"></script>\n';
  var srcbootstrapCss = '<link href="lib/bootstrap-3.0.0/dist/css/bootstrap.min.css" rel="stylesheet" media="screen">\n';
  var srcCoffee = '<script src="lib/coffee.js"></script>\n';
  var srcbootstrapJs = '<script src="lib/bootstrap-3.0.0/dist/js/bootstrap.min.js"></script>\n';

   // iframeのソースに初期値を設定
  var startSrc =
    doctype +
    "<html>\n" +
    openHead +
    srcbootstrapCss +
    closeHead +
    openBody +
    srcjquery +
    srcCoffee +
    openCss +
    closeCss +
    openCoffee +
    closeCoffee +
    closeBody +
    "\n</html>";

  var emecoBrowserSrc = startSrc;

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
  var modals = [ "#htmlFileName", "#cssFileName", "#coffeeFileName"];
  var extensions = [ ".html", ".css", ".coffee" ];
  var okButtons = [ "#htmlOK", "#cssOK", "#coffeeOK" ];
  var cancelButtons = $( ".cancelButton" );
  var modalBody = [ "#saveHtml", "#saveCss", "#saveCoffee" ];

  $.each( modals, function( i ) {
    // saveボタンを押したらフォーカスが入力するところに当たる
    $( saveButtons[ i ] ).on( "click", function() {
      setTimeout( function(){
        $( modals[ i ] ).focus();
      }, 400);
    });

    // ダイアログにダウンロードイベント追加
    $( okButtons[ i ] ).on( "click", function( e ) {
      var filename = $( modals[i] ).val();

      if ( filename ) {
        // エディタの中身を取る
        var editorSrc = editorContents( editors[ i ] );

        // 拡張子が入ってなかったら補う
        if ( !filename.contains( extensions[ i ] ) ) {
          filename += extensions[ i ];
        }

        // URL生成
        var blob = new Blob( [ editorSrc ], { type: 'text/plain' } );
        var fileURL = URL.createObjectURL( blob );

        // ダウンロードリンクを生成
        var downloadLink = $( "<a>" ).attr({
          href: fileURL,
          download: filename
        }).text( filename )[ 0 ];

        // 擬似的にクリックする
        var evt = document.createEvent( "MouseEvents" );
        evt.initEvent( "click", false, true );
        downloadLink.dispatchEvent( evt );
      }
      else {
        alert( "ファイル名を入力してください。" );
        e.stopImmediatePropagation();
        $( modals[ i ] ).focus();
      }
    });

    // enterを押したら保存
    $( modals[ i ] ).on( "keydown", function( e ) {
      if ( e.keyCode === 13 ) {
        $( okButtons[ i ] ).click();
      }
    });

    // モーダルが消えたらエディタにフォーカスを返す
    $( modalBody[ i ] ).on( "hide.bs.modal", function() {
      editors[ getActive() ].focus();
    });
  });

  // =================================================================


  // 即時反映 ========================================================

  // TODO: cssとjsがローカルファイルを参照してるときに、ターミナルから
  //       カレントディレクトリのファイルを開けた時しかうまく引っ張って
  //       これないことがわかった。
  //       ユーザー名を引っ張ってきて、localhostからの絶対パスを入れれば
  //       いけるかも

  // 正規表現を変数にしとく
  var regWholeHead = /<head>(\n|.)*<\/head>/;
  var regCloseHead = /<\/head>/;
  var regWholeBody = /<body>(\n|.)*<\/body>/;
  var regWholeCss = /<style id="emecoCss">(\n|.)*<\/style>/;
  var regWholeCoffee = /<script type="text\/coffeescript" id="emecoCoffee">(\n|.)*<\/script>/;

  // htmlはiframeのソースへ
  htmlEditor.on( "change", function() {
    var htmlSrc = editorContents( htmlEditor );

    // doctypeとhtmlタグを書いてあったらもう入ってるから消す
    htmlSrc.replace( /<!doctype html>\n/, "" );
    htmlSrc.replace( /<html>\n/, "");
    htmlSrc.replace( /\n<\/html>/, "");

    // headの中身をエディタに書いてあったら書き換える
    if (htmlSrc.match( /<head>/ ) && htmlSrc.match( regCloseHead ) ) {
      var editorHead = htmlSrc.match( regWholeHead )[ 0 ];
      emecoBrowserSrc = emecoBrowserSrc.replace( regWholeHead, editorHead );
      emecoBrowserSrc = emecoBrowserSrc.replace( regCloseHead, srcbootstrapCss + closeHead );
      htmlSrc = htmlSrc.replace( regWholeHead, "" );
    }

    // bodyは基本書き換える
    var editorBody;

    // css
    var cssSrc = emecoBrowserSrc.match( regWholeCss )[0];

    // coffee
    var coffeeSrc = emecoBrowserSrc.match( regWholeCoffee )[0];

    // エディタにbodyタグが入ってたら中身を入れ替える
    if (htmlSrc.match( /<body>/ ) && htmlSrc.match( /<\/body>/ ) ) {
      editorBody = htmlSrc.match( regWholeBody )[0];
    }
    // そうじゃなければエディタの中身を全部bodyに入れる
    else {
      editorBody = openBody + htmlSrc + closeBody;
    }

    emecoBrowserSrc = emecoBrowserSrc.replace( regWholeBody, editorBody );


    // cssとcoffeeを入れる
    var cssAndCoffee = cssSrc + srcjquery + srcbootstrapJs + srcCoffee + coffeeSrc + closeBody;
    emecoBrowserSrc = emecoBrowserSrc.replace( /<\/body>/, cssAndCoffee );
    emecoBrowser.srcdoc = emecoBrowserSrc;
    saveFlag = false
  });

  // TODO iframeがheadを空にする問題を解決したい
  cssEditor.on( "change", function() {
    var editorCss = editorContents( cssEditor );
    var cssSrc = openCss + editorCss + closeCss;

    emecoBrowserSrc = emecoBrowserSrc.replace( regWholeCss, cssSrc);
    emecoBrowser.srcdoc = emecoBrowserSrc;
    saveFlag = false
  });


  // coffeeをbodyへ
  $( "#coffeeButton" ).on( "click", function() {
    // coffeeのエディタの中身を取る
    var editorCoffee = editorContents( coffeeEditor );
    var coffeeSrc = openCoffee + editorCoffee + closeCoffee;

    emecoBrowserSrc = emecoBrowserSrc.replace( regWholeCoffee, coffeeSrc );
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
    $( previous[index] ).css( "display", "none" );
    $( next[index] ).css( "display", "block" );
    return next;
  };

  $.each( editors, function( i ) {
    editors[ i ].on( "vim-mode-change", function() {

      if ( editors[ i ].state.vim.insertMode ) {
        currentMode = switchMode( i, currentMode, insertMode );
      }
      else if ( editors[ i ].state.vim.visualMode ) {
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
})();
