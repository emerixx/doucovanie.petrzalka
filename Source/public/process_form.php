<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);
$mail->SMTPDebug = 2; // Set to 2 for detailed debug output

try {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);


    //Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Set the SMTP server to send through (e.g., smtp.gmail.com)
    $mail->SMTPAuth = true;
    $mail->Username = 'doucovanie.petrzalka@gmail.com'; // Your SMTP username (email)
    $mail->Password = 'xzumzclbduqthuwn'; // Your SMTP password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587; // TCP port to connect to

    //Recipients
    $mail->setFrom('doucovanie.petrzalka@gmail.com', 'Mailer');
    $mail->addAddress('doucovanie.petrzalka@gmail.com'); // Add a recipient

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';
    $bodyContent = "Name: {$name}<br>Email: {$email}<br>Message:<br>{$message}";
    $mail->Body = $bodyContent;

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>