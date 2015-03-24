<?php
$host  = $_SERVER['HTTP_HOST'];
$uri  = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');

// For now, just redirect to a budget
$extra = 'budget.html?id='.uniqid();

header("Location: http://$host$uri/$extra");
exit;

?>