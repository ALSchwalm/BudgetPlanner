<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Budget Planning Tool</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css">
    <script src="js/lib/jquery.js"></script>
    <script src="js/lib/bootstrap.js"></script>
    <style>
      tr td {
        cursor: pointer;
      }

     .table tbody tr:hover td {
       background-color: #f8f8f8;
     }
      </style>
  </head>
  <body>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="collapse navbar-collapse">
          <a class="navbar-brand" href="#">HPC² Budget Utility</a>
          <ul class="nav navbar-nav">
            <li><a href="#">Help</a></li>
          </ul>
          <form class="navbar-form navbar-right">
            <button id="newbudget" class="btn btn-primary">New Budget</button>
          </form>
        </div>
      </div>
    </nav>
    <div class="container">
      <h3>Existing Budgets</h3>
      <table class="table">
        <tr>
          <th>#</th>
          <th>Budget Name</th>
          <th>Primary Investigator</th>
        </tr>
        <?php
        include("connection.php");
        $sql_query = "SELECT id, title, pi FROM saved";
        $result = mysql_query($sql_query)
          or die('Invalid query: ' . mysql_error());

        $count = 1;
        while ($row = mysql_fetch_assoc($result)) {
          echo "<tr link=".$row["id"].">";
          echo     "<td>".$count."</td>";
          echo     "<td>".$row["title"]."</td>";
          echo     "<td>".$row["pi"]."</td></tr>";
          $count += 1;
        }
        ?>
      </table>
    </div>
    <script>
     $("#newbudget").click(function(e){
       document.location.href = "budget.html?id="+Math.random().toString(36).substring(5);
       e.preventDefault();
     });

     $("tr td").click(function(){
       var id = $(this).parent().attr("link");
       document.location.href = 'budget.html?id=' + id;
     });
    </script>
  </body>
</html>
