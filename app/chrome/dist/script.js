var Link = function (data) {
  this.data = data;
  this.next = null;
  this.previous = null;
};

var LinkedList = function () {
	this.head = null;
	this.tail = null;
};

LinkedList.prototype.push = function (link) {
  if (!(link instanceof Link)){
    throw new Error('the link argument must be an instance of the Link constructor');
  }
	// adds an item to the end of the list
  if (this.tail === null) {
  	this.head = this.tail = link;
  } 
  else {
  	var previous = this.tail;
  	this.tail.next = this.tail = link;
  	this.tail.previous = previous;
  }
};

LinkedList.prototype.pop = function () {
		var output = this.tail;
		if (this.head === this.tail) {
      this.head = this.tail = null;
 	  } else {
		  this.tail = this.tail.previous;
		  this.tail.next=null;
 	  }
 	  return output;
};

LinkedList.prototype.shift = function () {
  // removes the first item in the list
  var output = this.head;
  if (this.head === this.tail) {
  	this.head = this.tail = null;
  } else {
  	this.head = this.head.next;
  	this.head.previous = null;
  }
  return output;
};

LinkedList.prototype.unshift = function (link) {
  if (!(link instanceof Link)){
    throw new Error('the link argument must be an instance of the Link constructor');
  }
  // adds an item to the front of the list
  if (this.head === null) {
  	this.head = this.tail = link;
  } 
  else {
  	var next = this.head;
  	this.head.previous = this.head = link;
    this.head.next = next;
  }
};

var Queue = (function() {
  return function() {
    var storage = {};
    var hash = {};
    this.first = -1;
    this.last = -1;

    var setFirst = function() {
      while (!storage[this.first]) {
        this.last = this.last === this.first ? this.first = -1 : this.last;
        if (this.last === -1) {
          break;
        }
        this.first++;
      }
    };

    this.enqueue = function(key, data) {
      if (!key || !data) {
        throw new Error('Queue.enqueue expects both key and data arguments');
      }
      if (typeof key !== 'string') {
        throw new Error('Queue.enqueue expects the key argument to be a string');
      }
      this.last++;
      this.first = this.first === -1 ? this.last : this.first;
      hash[key] = this.last;
      storage[this.last] = {
        key: key,
        data: data
      };
    };

    this.dequeue = function() {
      if (this.first === -1) {
        return null;
      }
      var obj = storage[this.first];
      delete storage[this.first];
      delete hash[obj.key];
      setFirst.call(this);
      return obj;
    };


    this.delete = function(key) {
      if (typeof key !== 'string') {
        throw new Error('Queue.delete expects the key argument to be a string');
      }
      var index = hash[key];
      delete storage[index];
      delete hash[key];
      if (this.first === index) {
        setFirst.call(this);
      }
    };

    this.update = function(key, data) {
      this.delete(key);
      this.enqueue(key, data);
    };
  };
})();

var removeTab = function(){
  this.dequeue();
  initializeTimer.call(this);
};

var timer;
//timer is set here for now because I want access to it on my initializeTimer function

var userTimeLimit;
//userTimeLimit will be set by user somewhere

var initializeTimer = function(){
  if(timer){
    clearTimeout(timer);
  }
  if(this.first === -1){
    return null;
  }
  var elapsedTime = (new Date()).getTime() - this.structure[this.first].data.createdAt;
  //I'm naming it queue.structure[this.first].data.createdAt for now, can be named something else eventually
  var timeRemaining = userTimeLimit - elapsedTime;
  if(timeRemaining <= 0){
    removeTab.call(this);
  }
  else{
    timer = setTimeout(removeTab.bind(this), timeRemaining);
  }
};



(function () {
  /* globals $: false */
  $(function(){
    /* globals chrome: false */
    console.log('Service Initialized');

    chrome.browserAction.onClicked.addListener(function(){
      getTab(postTabs);
    });

    function getTab(callback){
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabArray){
        var tab = tabArray[0];
        var url = [tab.url];
        
        console.log(url);

        callback(url).then(console.log('success'));
      });
    }

    function postTabs(urls) {
      // sending object
      return new Promise(function(resolve,reject){
        $.ajax({
          type: 'POST',
          url: 'http://localhost:8080/links',
          data: {urls:urls},
          success: resolve
        })
        .fail(reject);
      });
    }
  });
})();