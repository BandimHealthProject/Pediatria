/**
 * This is the file that will be creating the list view.
 */
/* global $, odkTables, odkData, odkCommon */
/*exported display, handleClick, getResults */
'use strict';

var triagem = {};

/** Handles clicking on a list item. Applied via a string. */
// Lunch follow-up form for rounds
function handleClick(index) {	
    if (!$.isEmptyObject(triagem)) {
        odkTables.editRowWithSurvey(
        		null,
                'triagem',
                index,
                'laterounds',
                null);
    }
}

function cbSRSuccess(searchData) {
    console.log('cbSRSuccess data is' + searchData);
    if(searchData.getCount() > 0) {
        // open filtered list view if date found
    	var rowId = searchData.getRowId(0);
    	odkTables.openTableToListView(
    			null,
				'triagem',
				'_id = ?',
				[rowId],
				'config/tables/triagem/html/triagem_laterounds.html');
    } else {
        document.getElementById("search").value = "";
        document.getElementsByName("query")[0].placeholder="Client not found";
    }
}

function cbSRFailure(error) {
    console.log('triagem_laterounds: cbSRFailure failed with error: ' + error);
}

// filters list view by regdate entered by user
function getResults() {
    var searchText = document.getElementById('search').value;
    
    odkData.query('triagem', 'regdate = ?', [searchText], null, null, 
    		null, null, null, null, true, cbSRSuccess, cbSRFailure);
}

// displays list view of patients
function render() {

    // create button that adds patients to the system - launches triagem form
    var addClient = document.createElement('p');
    addClient.onclick = function() {
        odkTables.addRowWithSurvey(
        		null,
                'triagem',
                'lateroundsQuick',
                null,
                null);
    };
    addClient.setAttribute('class', 'launchForm');
    addClient.innerHTML = 'Add child';
    document.getElementById('searchBox').appendChild(addClient);

    for (var i = 0; i < triagem.getCount(); i++) {

        var regdateEntered = triagem.getData(i, 'regdate');
        var nameEntered = triagem.getData(i, 'nome');
        var dobEntered = triagem.getData(i, 'dob');
        var	sexEntered = triagem.getData(i, 'sex');
        var checkSmxcau = triagem.getData(i, 'smxcau');
        var roundsdateEntered = triagem.getData(i, 'roundsdateinit');
        var q = new Date();
        var m = q.getMonth();
        var d = q.getDate();
        var y = q.getFullYear();

        var today = new Date(y,m,d);
        if (roundsdateEntered !== null) {
        	var rdate = new Date(roundsdateEntered.substring(0,4),roundsdateEntered.substring(5,7)-1,roundsdateEntered.substring(8,10));
        } else {
        	var rdate = null
        }

        // make list entry
        // Only show not patients not yet checked today
       //if ((checkSmxcau === "55" && today > rdate) || (checkSmxcau === "55" && roundsdateEntered === null)){
        if (checkSmxcau === "55"){    
        /*    Creating the item space    */
            var item = document.createElement('li');
            item.setAttribute('class', 'item_space');
            item.setAttribute(
                    'onClick',
                    'handleClick("' + triagem.getRowId(i) + '")');
            item.innerHTML = regdateEntered.substring(8,10) + regdateEntered.substring(4,7) + '-' + regdateEntered.substring(0,4);
            document.getElementById('list').appendChild(item);

            var chevron = document.createElement('img');
            chevron.setAttribute(
                    'src',
                    odkCommon.getFileAsUrl('config/assets/img/little_arrow.png'));
            chevron.setAttribute('class', 'chevron');
            item.appendChild(chevron);

            // create sub-list in item space
            //  Name information
            var name = document.createElement('li');
            name.setAttribute('class', 'detail');
            name.innerHTML = 'Name: ' + nameEntered;
            item.appendChild(name);

            //  DoB information
            var dob = document.createElement('li');
            dob.setAttribute('class', 'detail');
            if(dobEntered !== null) {
            	dobEntered = dobEntered.substring(8,10) + dobEntered.substring(4,7) + '-' + dobEntered.substring(0,4);
            }
            dob.innerHTML = 'DoB: ' + dobEntered;
            item.appendChild(dob);
            
            //  Sex information
            var sex = document.createElement('li');
            sex.setAttribute('class', 'detail');
            if(sexEntered === '1') {
            	sexEntered = 'Male';
            } else if(sexEntered === '2') {
            	sexEntered = 'Female'
            }
            sex.innerHTML = 'Sex: ' + sexEntered;
            item.appendChild(sex);
        }
    }
}

function cbSuccess(result) {
	triagem = result;
    render();
}

function cbFailure(error) {
    console.log('triagem_laterounds: failed with error: ' + error);
}

function display() {
    odkData.getViewData(cbSuccess, cbFailure);
}
