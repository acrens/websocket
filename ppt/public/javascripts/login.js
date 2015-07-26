$(function() {
    $('#submitBtn').click(function() {
        var username = $('#username');
        var usernameVal = username.val().trim();
        var password = $('#password');
        var passwordVal = password.val().trim();
        if (!usernameVal) {
            username.focus();
            username.css('border', '1px solid #f00');
            return;
        } else {
            username.css('border', 'none');
        }

        if (!passwordVal) {
            password.focus();
            password.css('border', '1px solid #f00');
            return;
        } else {
            password.css('border', 'none');
        }
        form.submit();
        /*$.ajax({
            url: '/',
            type: 'GET',
            data: {
                username: usernameVal,
                passwordVal: passwordVal
            },
            success: function(data) {

            }
        });*/
    });

    $('#username').blur(function() {
        var val = this.value.trim();
        if (!val) {
            $(this).focus();
            $(this).css('border', '1px solid #f00');
        } else {
            $(this).css('border', 'none');
        }
    });

    $('#password').blur(function() {
        var val = this.value.trim();
        if (!val) {
            $(this).focus();
            $(this).css('border', '1px solid #f00');
        } else {
            $(this).css('border', 'none');
        }
    });

    var socket = io.connect();

    // 下一页PPT
    $('#next').click(function() {
        socket.emit('next', {
            text: 'next'
        });
        console.log('next');
    });

    // 上一页PPT
    $('#prev').click(function() {
        socket.emit('prev', {
            text: 'prev'
        });
        console.log('prev');
    });

    // 接收prev weksocket事件
    socket.on("next", function(data) {
        nextSlide();
    });

    // 监听prev weksocket事件
    socket.on("prev", function(data) {
        prevSlide();
    });

    // 聊天用户名输入
    $('.J_btn').on('click', function() {
        var chat = $('.J_chat');
        var username = $('.J_username');
        var val = username.val();

        if(val) {
            username.parent().hide();
            chat.parent().show();
            chat.focus();
            socket.emit('online', {
                username: val
            });
        } else {
            alert('请输入用户名');
        }
    });

    $('.J_username').on('keyup', function(e) {

        if(e.keyCode == 13) {
            var chat = $('.J_chat');
            var username = $('.J_username');
            var val = username.val();

            if(val) {
                username.parent().hide();
                chat.parent().show();
                chat.focus();
                socket.emit('online', {
                    username: val
                });
            } else {
                alert('请输入用户名');
            }
        }
        
    });

    // 发送聊天信息
    $('.J_submit').on('click', function() {
        var chat = $('.J_chat');
        var chatText = chat.val();
        var username = $('.J_username').val();

        socket.emit('chats', {
            username: username,
            text: chatText
        });

        chat.val('');
    });

    $('.J_chat').on('keyup', function(e) {

        if(e.keyCode == 13) {
            var chat = $('.J_chat');
            var chatText = chat.val();
            var username = $('.J_username').val();

            socket.emit('chats', {
                username: username,
                text: chatText
            });

            chat.val('');
        }
        
    });

    socket.on('onlines', function(data) {
        var username = data.username;
        var main = $('.main');

        main.append('<div class="online_user">' + username + '  已上线</div>');
    });

    // 监听广播聊天内容
    socket.on('chat', function(data) {
        var main = $('.main');
        var username = $('.J_username').val();

        if(username == data.username) {
            var content = $('<div class="master"><div class="text t_right">'
                + '<span class="bc0CEA85">' + data.text + '</span>'
                + '<div class="username bc0CEA85 ml10 fl_none">' 
                + data.username + '</div></div></div>');
            main.append(content);
        } else {
            var content = $('<div class="guest"><div class="username mr10">'
                + data.username + '</div><div class="text"><span>' 
                + data.text + '</span></div></div>');
            main.append(content);
        }
    });
});
