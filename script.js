const marcasCombo = document.querySelector("#marcas");
const modelosCombo = document.querySelector("#modelos");
const anosCombo = document.querySelector("#anos");
const valor = document.querySelector("#veiculo_valor");

async function getMarcas() {
  let marcas;
  await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas", {
    method: "GET",
    mode: "cors",
  })
    .then((resposta) => resposta.json())
    .then((data) => (marcas = data))
    .catch((erro) => erro);
  return marcas;
}

async function getModelos(marca) {
  let modelos;
  await fetch(
    `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos`,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((resposta) => resposta.json())
    .then((data) => (modelos = data.modelos))
    .catch((_) => console.log("Error"));

  return modelos;
}

async function getAnos(marca, modelo) {
  let anos;
  await fetch(
    `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos`,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((resposta) => resposta.json())
    .then((data) => (anos = data))
    .catch((_) => console.log("Error"));

  return anos;
}

async function getValor(marca, modelo, ano) {
  let valorDoCarro;
  await fetch(
    `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos/${ano}`,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((resposta) => resposta.json())
    .then((data) => (valorDoCarro = data))
    .catch((_) => console.log("Error"));

  return valorDoCarro;
}

const carregarMarcas = async () => {
  marcas = await getMarcas();
  return marcas;
};

const carregarModelos = async (marca) => {
  modelos = await getModelos(marca);
  return modelos;
};

const carregarAnos = async (marca, modelo) => {
  anos = await getAnos(marca, modelo);
  return anos;
};

const carregarValorDoCarro = async (marca, modelo, ano) => {
  valorDoCarro = await getValor(marca, modelo, ano);
  return valorDoCarro;
};

document.addEventListener("DOMContentLoaded", async function () {
  marcas = await carregarMarcas();
  marcasCombo.innerHTML = "";
  marcasCombo.disabled = null;

  let selectOption = document.createElement("option");
  selectOption.textContent = "Selecione a marca do carro";
  selectOption.value = "";
  anosCombo.appendChild(selectOption);

  marcas.forEach(function (marca, indce) {
    let optionMarca = document.createElement("option");
    optionMarca.textContent = marca.nome;
    optionMarca.value = marca.codigo;
    marcasCombo.appendChild(optionMarca);
  });
});

marcasCombo.addEventListener("change", async function (event) {
  modelosCombo.innerHTML = "";
  modelosCombo.disabled = null;
  if (marcasCombo.value) {
    modelos = await carregarModelos(marcasCombo.value);
    modelosCombo.innerHTML = '<option selected="" value="">Choose...</option>';
    modelos.forEach((modelo) => {
      modelosCombo.append(
        new Option((text = modelo.nome), (value = modelo.codigo))
      );
    });
  } else {
    modelosCombo.innerHTML = "";
    let selectOption = document.createElement("option");
    selectOption.textContent = "Selecione uma Marca";
    selectOption.value = "";
    modelosCombo.appendChild(selectOption);
  }
});

modelosCombo.addEventListener("change", async function (event) {
  anosCombo.innerHTML = "";
  anosCombo.disabled = null;

  if (modelosCombo.value) {
    anos = await carregarAnos(marcasCombo.value, modelosCombo.value);
    anosCombo.innerHTML = '<option selected="" value="">Choose...</option>';
    anos.forEach((ano) => {
      anosCombo.append(new Option((text = ano.nome), (value = ano.codigo)));
    });
    valor.value = "";
  } else {
    anosCombo.innerHTML = "";
    let optionAno = document.createElement("option");
    optionAno.textContent = "Selecione um Modelo";
    optionAno.value = "";
    anosCombo.appendChild(optionAno);
  }
});

anosCombo.addEventListener("change", async function (event) {
  if (anosCombo.value) {
    valorDoCarro = await carregarValorDoCarro(
      marcasCombo.value,
      modelosCombo.value,
      anosCombo.value
    );
    valor.value = `${valorDoCarro}`;
  }
});
carregarMarcas();
