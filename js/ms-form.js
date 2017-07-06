$(document).ready(function() {
	
    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
    	$("#tp-logradouro").val("");
    	$("#logradouro").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#estado").val($("#estado option:first").val());
    }
	
    $.getJSON("api/estados")
    .done(function (data) {
        if (!data) {
            return
        }
        console.log(data);
        $(data._embedded.estados).each(function () {
            $('#estado').append('<option value="' + this.siglaEstado + '">' + this.nomeEstado + '</option>');
        });
    });
});

$('#cep').blur(function() {

    //Nova variável "cep" somente com dígitos.
    var cep = $(this).val().replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
        	$("#tp-logradouro").val("...");
        	$("#logradouro").val("...");
            $("#bairro").val("...");
            $("#cidade").val("...");

            //Consulta o webservice viacep.com.br/
            $.getJSON("//viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                if (!("erro" in dados)) {
                    //Atualiza os campos com os valores da consulta.
                    var arrlogradouro = dados.logradouro.split(" ");
                	$("#tp-logradouro").val(arrlogradouro[0]);
                	$("#logradouro").val(dados.logradouro.replace(arrlogradouro[0] + " ", ""));
                    $("#bairro").val(dados.bairro);
                    $("#cidade").val(dados.localidade);
                    //$("#uf").val(dados.uf);
		            $('#estado option[value="' + dados.uf + '"]').attr({ selected : "selected" });
                } //end if.
                else {
                    //CEP pesquisado não foi encontrado.
                    limpa_formulário_cep();
                    alert("CEP não encontrado.");
                }
            });
        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
});