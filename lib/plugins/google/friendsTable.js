ig.module(
  'plugins.google.friendsTable'
)
.requires(
)
.defines(function(){
  ig.GGS.friendsTable = {
    pageTokens: [''],
    currPage: 0
  };

  ig.GGS.friendsTable.showBuddies = function() {
    ig.GGS.friendsTable.loadUpFriends(0);
  };

  ig.GGS.friendsTable.showNext = function() {
    ig.GGS.friendsTable.loadUpFriends(ig.GGS.friendsTable.currPage + 1);
  };

  ig.GGS.friendsTable.showPrev = function() {
    ig.GGS.friendsTable.loadUpFriends(ig.GGS.friendsTable.currPage - 1);
  };

  ig.GGS.friendsTable.loadUpFriends = function(pageNum)
  {
    ig.GGS.friendsTable.clearOut();
    ig.GGS.friendsTable.currPage = pageNum;

    if (pageNum >0 && pageNum < ig.GGS.friendsTable.pageTokens.length) {
      var optionalPageToken = ig.GGS.friendsTable.pageTokens[pageNum];
    }

    // For an interesting twist, try changing this to 'best'
    var paramsObject = {
      'orderBy': 'alphabetical',
      'maxResults': 20
    };
    
    if (optionalPageToken) paramsObject.pageToken = optionalPageToken;
    gapi.client.request({
      path: ig.GGS.login.plusPath + '/people/me/people/visible',
      params: paramsObject,
      callback: function(data) {
        console.log('This is friends data: ', data);
        if (data.hasOwnProperty('items')) {
          for (var i = 0; i < data.items.length; i++) {
            var $personRow = friendsTable.buildTableRowFromData(data.items[i]);
            $personRow.appendTo($friendTableBody);
          }
          if (data.hasOwnProperty('nextPageToken')) {
            friendsTable.pageTokens[pageNum + 1] = data.nextPageToken;
          }
          friendsTable.refreshPageButtons();
        }
        $('#friends').fadeIn();
      }
    });


  };

  friendsTable.refreshPageButtons = function()
  {
    $('#pageFriendsNext').prop('disabled', (friendsTable.currPage +1) >= friendsTable.pageTokens.length);
    $('#pageFriendsPrev').prop('disabled', friendsTable.currPage  <= 0);

  };

  friendsTable.buildTableRowFromData = function(rowObj) {
    var $tableRow = $('<tr></tr>');
    // TODO: Add link to their profile
    var $nameCell = $('<td></td>').append(($('<a></a>')).prop('href',rowObj.url).text(rowObj.displayName));
    var $iconCell = $('<td></td>').append($('<img />')
        .prop('src', rowObj.image.url));

    $tableRow.append($iconCell).append($nameCell);

    return $tableRow;

  };


  friendsTable.clearOut = function() {
    $('#friendsTable tbody').html('');
  };

  friendsTable.goBack = function() {
    $('#friends').hide();
    welcome.loadUp();

  };
});