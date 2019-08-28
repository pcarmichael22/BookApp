# BookApp
Lab 11 - Sarah Gilliam, Peter Carmichael, John Bavedam

This full stack application allows users to search for books using the googleBooks API. We allow users to add books to their personal libraries and modify their libraries as they please.

<!-- Tools required to load app -->

<!-- /\/\/\/\ WORKFLOW /\/\/\/\ -->

Number and name of feature: Filetree and Basic Server Buildout

Estimate of time needed to complete: 60:00

Start time: 9:10

Finish time: 9:50

Actual time needed to complete: 40:00



    <% for(let i = 0; i < myData.length; i++){ %>
        <div id="bookView">
            <a href="<%= myData[i].link %>">
                <%= myData[i].title %>
            </a>
            <h2>
                <%= myData[i].author %>
            </h2>
            <p>
                <%= myData[i].description %>
            </p>
            <img src="<%= myData[i].thumbnail %>" />
            <p>
                <%= myData[i].pagecount %>
            </p>
            <p>
                <%= myData[i].rating %>
            </p>
        </div>
        <div id="Hidden Menu">
            <form action="book-save" method="POST">
                <input type="text" name="title" value="<%= myData[i].title %>">
                <input type="text" name="author" value="<%= myData[i].author %>">
                <input type="text" name="description" value="<%= myData[i].description %>">
                <input type="text" name="thumbnail" value="<%= myData[i].thumbnail %>">
                <input type="text" name="isbn" value="<%= myData.isbn %>">
                <input type="text" name="pagecount" value="<%= myData[i].pagecount %>">
                <input type="text" name="rating" value="<%= myData[i].rating %>">
                <input type="text" name="link" value="<%= myData[i].link %>">
                <input id="inputBox" type="button" name="saveBook" placeholder="Save Book to Your Library">
            </form>
        </div>
        <% } %>
            </div>