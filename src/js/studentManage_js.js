
var menu = document.getElementById('menu');
var modal = document.getElementsByClassName('modal')[0];
var allTableData = [];

// 初始化
function init() {
    renderTable();
    bindEvent();
}
init();
// 事件绑定
function bindEvent() {
    // 左侧功能栏点击事件
    menu.onclick = function (e) {
        var tagName = e.target.tagName;
        if(tagName != 'DD'){
            return false;
        }
        initContentShow(e.target);
        initMenuList();
        e.target.classList.add('active');
    }
    // 编辑删除按钮点击事件
    var editBtn = document.getElementsByClassName('edit');
    var delBtn = document.getElementsByClassName('delete')
    for(var i = 0; i < editBtn.length; i++){
        editBtn[i].onclick = function(){
            modal.classList.add('show');
            var index = this.getAttribute('data-index');
            initEditForm(allTableData[index]);
        }
        delBtn[i].onclick = function () {
            var isDel = window.confirm('确认删除？');
            if(!isDel){
                return false;
            }
            var index = this.getAttribute('data-index');
            var result = ajaxFunc('http://api.duyiedu.com/api/student/delBySno',{
                appkey : 'yugiasuna_1556039918709',
                sNo : allTableData[index].sNo
            });
            if(result.status === 'success'){
                alert('删除成功!');
                renderTable();
            }
        }
    }
    // 遮罩层点击隐藏编辑区
    var mask = document.getElementsByClassName('mask')[0];
    mask.onclick = function(){
        modal.classList.remove('show');
    }
    // 学生信息编辑数据交互
    var editForm = document.getElementById('edit-student-form');
    var editSubmitBtn = document.getElementsByClassName('edit-submit')[0];
    editSubmitBtn.onclick = function (e) {
        e.preventDefault();
        var obj = Object.assign({
            appkey : 'yugiasuna_1556039918709'
        },getFormData(editForm));
        var result = ajaxFunc('http://api.duyiedu.com/api/student/updateStudent',obj);
        console.log(result);
        if(result.status == 'success'){
            editForm.reset();
            alert('修改成功');
            modal.classList.remove('show');
            renderTable();
        }
    }
    // 学生信息添加数据交互
    var addSubmitBtn = document.getElementsByClassName('add-submit')[0];
    var addForm = document.getElementById('add-student-form');
    addSubmitBtn.onclick = function (e) {
        e.preventDefault();
        var studentData = getFormData(addForm);
        var obj = Object.assign({
            appkey : 'yugiasuna_1556039918709'
        },studentData);
        var result = ajaxFunc('http://api.duyiedu.com/api/student/addStudent',obj);
        if(result.status === 'success'){
            alert('添加成功');
            renderTable();
            var studentList = document.getElementsByTagName('dd')[0];
            studentList.click();
            //location.reload();
        }
        else{
            alert(result.msg);
        }
    }
}

// 初始化左侧导航样式
function initMenuList() {
    var active = document.getElementsByClassName('active');
    for(var i = 0; i < active.length; i++){
        active[i].classList.remove('active');
    }
}

// 初始化右侧内容区
function initContentShow(dom) {
    var id = dom.getAttribute('data-id');
    var rightContent = document.getElementById(id);
    var page = document.getElementsByClassName('page');
    for(var i = 0; i < page.length; i++){
        page[i].style.display = 'none';
    }
    rightContent.style.display = 'block';
}

// 向后端存储数据
function ajaxFunc(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

// 渲染表格数据
function renderTable() {
    // 获取学生信息
    var data = ajaxFunc('http://api.duyiedu.com/api/student/findAll','appkey=yugiasuna_1556039918709');
    if(data.status == 'fail'){
        alert(data.msg);
        return false;
    }
    var tableData = data.data;
    allTableData = data.data;
    var tableBody = document.getElementById('student-body');
    var str = '';
    for(var i = 0; i < tableData.length; i++){
        str += '<tr>\n' +
            '<td>'+ tableData[i].sNo +'</td>\n' +
            '<td>'+ tableData[i].name +'</td>\n' +
            '<td>'+ (tableData[i].sex ? '女' : '男') +'</td>\n' +
            '<td>'+ tableData[i].email +'</td>\n' +
            '    <td>'+ (new Date().getFullYear() - tableData[i].birth) +'</td>\n' +
            '    <td>'+ tableData[i].phone +'</td>\n' +
            '    <td>'+ tableData[i].address +'</td>\n' +
            '    <td>\n' +
            '        <button class="btn edit" data-index="'+ i +'">编辑</button>\n' +
            '        <button class="btn delete" data-index="'+ i +'">删除</button>\n' +
            '    </td>\n' +
            '</tr>';
        tableBody.innerHTML = str;
    }
    bindEvent();
}

// 编辑表单回填
function initEditForm(data) {
    var editForm = document.getElementById('edit-student-form');
    for(var prop in data){
        if(editForm[prop]){
            editForm[prop].value = data[prop]
        }
    }
}

// 获取form表单的学生数据
function getFormData(form) {
    var sNo = form.sNo.value;
   var name = form.name.value;
   var sex = form.sex.value == 'male' ? 0 : 1;
   var email = form.email.value;
   var birth = form.birth.value;
   var phone = form.phone.value;
   var address = form.address.value;
   var student = {
       sNo : sNo,
       name : name,
       sex : sex,
       email : email,
       birth : birth,
       phone : phone,
       address : address,
       email : email
   }
   return student;
}