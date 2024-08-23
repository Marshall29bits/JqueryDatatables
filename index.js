var app = {
    backend: 'http://localhost:8081',
    
    init: function(){
        app.initDatatable('#productos');
        
        $("#save").click(function(){
            app.save({
                idProduct: $("#id").val(),
                name: $("#name").val(),
                value: $("#value").val()
            });
        });
    },
    initDatatable : function(id){
        var table = $(id).DataTable({
            ajax : {
                url: app.backend + '/products',
                dataSrc: function(json){
                    return json
                }
            },
            dom: 'Bfrtip',
            columns: [
                    {data : "idProduct"},
                    {data: "name"},
                    {data: "value"}
            ],
            buttons: [
                {
                    text: 'Editar',
                    action: function(e, dt, node, config){
                        var data = dt.rows('.table-active').data()[0];
                        app.setDataModal(data);
                        $('#productoModal').modal("show");
                    }
                },
                {
                    text: 'Crear',
                    action: function(e, dt, node, config){
                        app.setCleanModal();
                        $('#productoModal').modal("show");
                    }
                },
                {
                    text: 'Eliminar',
                    action: function(e, dt, node, config){
                        var data = dt.rows('.table-active').data()[0].idProduct;
                        app.delete(data);
                        
                    }
                }
                    
                    
            ]
            
        });
        $('#productos tbody').on('click', 'tr', function(){
            if ($(this).hasClass('table-active')){
                $(this).removeClass('table-active');
            }else{
                table.$('tr.table-active').removeClass('table-active');
                $(this).addClass('table-active');
            }
        });
        
    },
    setDataModal : function(data){
        $("#name").val(data.name);
        $("#value").val(data.value);
        $("#id").val(data.idProduct);
    },
    setCleanModal : function(){
        $("#name").val("");
        $("#value").val("");
        $("#id").val("");
    },
    save : function(data){
        if($("#id").val() != ""){
        $.ajax({
            url: app.backend + '/products/' + data.idProduct,
            data: JSON.stringify(data),
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(json){
                console.log("META");
                alert("Se guardo la persona correctamente");
                app.table.ajax.reload();

            },
            error: function(error){
                console.log("ERRORRRRRRRRR");
                console.log(error);
            }
        });
    }else{
        console.log("META 222");
        $.ajax({
            url: app.backend + '/products',
            data: JSON.stringify(data),
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(json){
                console.log("SI SE GUARDO");
                app.table.ajax.reload();
            },
            error: function(err){
                console.log(err);
            }


            
        });
    }   
    },
    delete : function(data){
        $.ajax({
            url: app.backend + '/products/' + data,
            type: 'DELETE',
            dataType: 'text',
            contentType: 'application/json; charset=utf-8',
            success: function(json){
                var table2 = $("#productos").DataTable();
                table2.ajax.reload();
            },
            error: function(err){
                console.log(err);
                console.log("errorr");
            }
        });
    }

}

$(document).ready(function(){
    app.init();
})

function cerrarModal(){
    $("#productoModal").modal("hide");
}