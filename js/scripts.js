let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function addListItem(pokemon) {
    let pokemonListElement = $(".pokemon-list");

    // Create a column for each Pokémon
    let column = $("<div></div>").addClass("col-sm-6 col-md-4 col-lg-2");

    let listItemPokemon = $("<div></div>").addClass("pokemon-item card mb-3");

    let button = $("<button></button>")
      .addClass("btn btn-primary btn-block")
      .text(capitalizeFirstLetter(pokemon.name))
      .attr("data-toggle", "modal")
      .attr("data-target", "#exampleModal");

    listItemPokemon.append(button);
    column.append(listItemPokemon);
    pokemonListElement.append(column);

    button.on("click", function () {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight; // Added weight
      item.types = details.types.map(typeInfo => typeInfo.type.name);
      item.abilities = details.abilities.map(abilityInfo => abilityInfo.ability.name); // Added abilities
    }).catch(function (e) {
      console.error(e);
    });
  }

  // Modal functionality
  (function () {
    function showModal(pokemon) {
      let modalTitle = $("#pokemonModalTitle");
      let modalBody = $(".modal-body");
      let modalContent = $(".modal-content");

      modalTitle.empty();
      modalBody.empty();

      let nameElement = $("<h1>" + capitalizeFirstLetter(pokemon.name) + "</h1>");
      let imageElement = $('<img class="modal-img" style="width:50%">');
      imageElement.attr("src", pokemon.imageUrl);

      let heightElement = $("<p>" + "Height: " + pokemon.height + "</p>");
      let weightElement = $("<p>" + "Weight: " + pokemon.weight + "</p>");
      let typesElement = $("<p>" + "Types: " + pokemon.types.join(", ") + "</p>");
      let abilitiesElement = $("<p>" + "Abilities: " + pokemon.abilities.join(", ") + "</p>");

      modalTitle.append(nameElement);
      modalBody.append(imageElement);
      modalBody.append(heightElement);
      modalBody.append(weightElement);
      modalBody.append(typesElement);
      modalBody.append(abilitiesElement);

      // Determine the background color based on the Pokémon's types
      let backgroundColor = "white"; // Default color

      if (pokemon.types.includes("fire")) {
        backgroundColor = "red";
      } else if (pokemon.types.includes("grass")) {
        backgroundColor = "green";
      } else if (pokemon.types.includes("poison")) {
        backgroundColor = "purple";
      } else if (pokemon.types.includes("water")) {
        backgroundColor = "blue";
      } else if (pokemon.types.includes("electric")) {
        backgroundColor = "yellow";
      }

      // Apply the background color to the modal
      modalContent.css("background-color", backgroundColor);

      $('#exampleModal').modal('show'); // Show the modal
    }

    window.showModal = showModal; // Expose showModal function to global scope
  })();

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
