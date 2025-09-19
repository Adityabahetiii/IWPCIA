-- Cleaned SQL for Railway MySQL
-- Table structure for table `user_form`

CREATE TABLE `user_form` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert data into table `user_form`
INSERT INTO `user_form` (`Id`, `username`, `email`, `password`) VALUES
(12, 'Aditya', 'ADITYABAHETI@GMAIL.COM', '12345'),
(13, 'surrendra', 'surendra@gmail.com', '123456');
