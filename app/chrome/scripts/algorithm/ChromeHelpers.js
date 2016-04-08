
/* globals $: false, chrome: false, ENV: false */

//////////  //////////  //////////  //////////  //////////  
// helper functions

var Chrome = (function () {
  return Object.create({
    postTabs : function (urls) {
      // sending object
      return new Promise(function(resolve,reject){
        $.ajax({
          type: 'POST',
          url: ENV.url + '/links',
          data: {urls: urls},
          success: resolve
        })
        .fail(reject);
      });
    },
    getTab : function (tabId) {
      return new Promise(function (resolve, reject) {
        try {
          chrome.tabs.get(tabId, resolve);
          // resolves the tab
        } catch (error) {
          reject(error);
        }
      });
    },
    getAllTabs : function () {
      return new Promise(function (resolve, reject) {
        try{
          chrome.tabs.query({}, resolve);
          //resolves all tabs
        } catch (error) {
          reject(error);
        }
      });
    },
    getActiveTabs : function () {
      return new Promise(function (resolve, reject) {
        try{
          chrome.tabs.query({'active':true}, resolve);
          //resolves active tabs
        } catch (error) {
          reject(error);
        }
      });
    },
    setData : function (tab) {
      var data = {};
      try {
        data = {
          url: tab.url,
          createdAt: Date.now()
        };
      } catch (error) {
        return Promise.reject(error);
      } 
      return Promise.resolve({data:data, tab: tab});
    },

    updateCurrentTabs : function (queue, currentTabs) {
      return new Promise(function (resolve, reject) {
        var deleteTabIfItDoesnotExist = function (bool) {
          if (!bool) {
            delete currentTabs[tabId];
            queue.delete(tabId);
          }
        };

        try {
          Chrome.getAllTabs()
          .then(Chrome.mapToTabIds)
          .then(function (tabIds) {
            for (var tabId in currentTabs) {
              Chrome.containsId(tabIds, Number(tabId))
              // .then(deleteTabIfItDoesnotExist);
              .then(function (bool) {
                if (!bool) {
                  delete currentTabs[tabId];
                  queue.delete(tabId);
                }
              });
            }
            resolve(queue);
          });
        } catch (error) {
          reject(error);
        }
      });
    },

    findOldTabId : function (tabIds, currentTabs) {
      console.log(tabIds, currentTabs);
      var oldTabId = [];
      try {
        oldTabId = Object.keys(currentTabs).filter(function (tabId) {
          return tabIds.some(function (id) {
            return String(id) !== tabId;    
          });
        });
      } catch (error) {
        return Promise.reject(error);
      }
      if (oldTabId.length > 1) {
        // return Promise.reject('Incorrect number of old tabs returned: "' + oldTabId.length + '" should be "1".');
      }


      return Promise.resolve(oldTabId[0] || null);
      //resolve the old tab id
    },


    mapToTabIds : function (tabs) {
      var tabIds = [];
      try {
        tabIds = tabs.map(function (tab) {return tab.id;});
      } catch (error) {
        return Promise.reject(error);
      }
      // console.log(tabs, tabIds);
      return Promise.resolve(tabIds);
      // return Promise.resolve(100);
    },

    containsId : function (tabIds, id) {
      var bool = 'false';
      try{
        bool = tabIds.some(function (tabId) {return tabId === id;});
      } catch (error) {
        return Promise.reject(error);
      }
      return Promise.resolve(bool);
    }
  });
})();

module.exports = Chrome;






//////////  //////////  //////////  //////////  ////////// 