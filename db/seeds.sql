use company_db;
INSERT INTO role (id, title, salary,department_id)
VALUES (10, "Engineer", 10000, 1010),
       (20, "Engineer", 30000,1010);
       

use company_db;
INSERT INTO department (id,name)
VALUES(1010,"Tools"),
       (1020,"Electrical"),
       (1030,"Informationtechnology"),
       (1040,"Accounting");
       
       
       
use company_db;
INSERT INTO employee (id,first_name,last_name,role_id,manager_id)
VALUES(101,"Jaic","JO",10,1),
       (102,"Ben","BOB",10,1),
       (103,"Pam","JO",10,1),
       (104,"Ann","smith",10,1);
       
