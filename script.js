var PhoneBook = function () {
  this._storage = []
  this._contactsPerPage = 5;
  this._currentPage = 0;
};

PhoneBook.prototype = {
  add: function (contactInfo) {
    this._storage.push({
      name: contactInfo.name,
      phone: contactInfo.phone,
      email: contactInfo.email
    })
    this._storage.sort(function (a, b) {
      return a.name > b.name
    })
  },
  remove: function (index) {
    this._storage.splice(index, 1);
  },
  search: function (query) {
    var contacts = this._storage;
    queryRegex = new RegExp(query, "i")
    filteredContacts = contacts.filter(function (contact) {
      return queryRegex.test(contact.name) || queryRegex.test(contact.phone)
    })
    return filteredContacts
  },
  list: function (query) {
    var contacts = this._storage;
    var startIndex = this._contactsPerPage * this._currentPage;
    var endIndex = startIndex + this._contactsPerPage ;
    if (endIndex >= contacts.length) {
      endIndex = contacts.length
    }
    if (!!query) {
      contacts = this.search(query)
    }
    return contacts.slice(startIndex, endIndex)
  }
};

var myPhoneBook = new PhoneBook();


// attach Event Listeners 
(function () {
  // initaal display on page load 
  displayList();

  // activate new contact box when on clicking the add new contact button 
  var newContactBox = document.getElementById('new-contact-box');
  var toggleNewContact = document.getElementById('toggle-new-contact');
  toggleNewContact.addEventListener('click', function (e) {
    newContactBox.style.display = newContactBox.style.display === 'none' ? '' : 'none';
  })

  // add contact form

  // keypress event on phone input to ensure the right format
  var phoneInput = document.getElementById('input-phone');
  phoneInput.addEventListener('keypress', function (e) {
    if (!(e.key >= 0 || e.key <= 9)) {
      e.preventDefault()
    } // if anything but a number is typed .. do nothin

    var lengthOfInput = e.target.value.length;
    if (lengthOfInput == 2 || lengthOfInput == 6) { // add automatic -
      e.target.value += '-'
    }

    if (lengthOfInput > 10) { // do nothing if the phone format is matched
      e.preventDefault();
    }
  });

  // email input
  var emailInput = document.getElementById('input-email');
  var outputMessage = document.getElementById('output-message');
  emailInput.addEventListener('change', function (e) {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!(emailRegex.test(e.target.value))) { // check the input against the email Regex . 
      e.target.value = '';
      outputMessage.innerText = "Invalid Email Address. Please Type valid Email."
    }
  });

  // add Contact 
  var addContactButton = document.getElementById('add-contact-info');
  var nameInput = document.getElementById('input-name');
  addContactButton.addEventListener('click', function () {
    if (nameInput.value == '') {
      outputMessage.innerText = "Please Enter name";
      return
    }
    if (phoneInput.value.length != 11) {
      outputMessage.innerText = "Please Enter A Valid Phone";
      return
    }
    if (emailInput.value == '') {
      outputMessage.innerText = "Please Enter A Valid Email";
      return
    }

    if (myPhoneBook._storage.length > 10000) {
      outputMessage.innerText = "Maximum number of contacts reached. Please remove some contacts first"
      return
    }
    myPhoneBook.add({
      name: nameInput.value,
      phone: phoneInput.value,
      email: emailInput.value
    });
    outputMessage.innerText = "Contact Info was successfully added";
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    displayList();
  })

  // implement search input
  var queryInput = document.getElementById('input-query');
  queryInput.addEventListener("keyup", function (e) {
    displayList(e.target.value);
  })

  // contacts per page
  var contactsPerPage = document.getElementById('contacts-per-page');
  contactsPerPage.addEventListener('click', function(e){            
      var elementClicked = e.target;
      if (elementClicked.tagName == 'BUTTON'){
          myPhoneBook._contactsPerPage = parseInt(elementClicked.dataset.value);
          myPhoneBook._currentPage = 0; // reset current page
          displayList();
      }  
  })

  // choose current page
  var pagination = document.getElementById('pagination');
  pagination.addEventListener('click', function(e){            
      var elementClicked = e.target;
      if (elementClicked.tagName == 'BUTTON'){
          myPhoneBook._currentPage = parseInt(elementClicked.dataset.value);
          displayList();
      }  
  })

  // remove contact 
  var tableBody = document.getElementsByTagName('tbody')[0];
  tableBody.addEventListener('click', function(e){
    elementClicked = e.target;
    if (elementClicked.tagName == 'BUTTON'){
      index = myPhoneBook._storage.findIndex(function(contact){
        return contact.name == elementClicked.dataset.name
      })     
      myPhoneBook.remove(index);
      displayList();
    }
  })
})();

function displayList(query) {
  contacts = myPhoneBook.list(query);
  var target = document.getElementsByTagName('tbody')[0];
  var output = '';
  contacts.forEach(function (contact) {
    output += "<tr> <td> " + contact.name + "</td> <td>" + contact.phone + "</td> <td>" + contact.email + "</td> <td> <button class='deleteButton' data-name="+ contact.name +" > Delete </button> </td> </tr>";
  });
  target.innerHTML = output;
  var pagination = document.getElementById('pagination')
  var numberOfPages =  Math.ceil(myPhoneBook._storage.length / myPhoneBook._contactsPerPage);;
  var pageLinks = ''
  for (var i = 0; i < numberOfPages;) {
    pageLinks += "<button data-value='"+ i +"'>" + ++i + "</button>"
  }
  pagination.innerHTML = pageLinks;
}