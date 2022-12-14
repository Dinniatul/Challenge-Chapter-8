/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const { Car } = require("../models");
const CarController = require('./CarController')


describe("CarController", ()=>{
    describe("#handleCreateCar", () =>{
        it("should call res.status(201) and res.json with task instance", async () => {
            const name = "Avanza";
            const prize = 10000;  
            const size = "Large";  
            const image = "avanza.jpg";  
      
            const mockRequest = {
              body: {
                name,
                prize,
                size,
                image
              },
            };
      
            const car = new Car({ name, prize,size,image });
            const mockCarModel = { create: jest.fn().mockReturnValue(car) };
      
            const mockResponse = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn().mockReturnThis(),
            };
      
            const carController = new CarController({ carModel: mockCarModel });
      
            await carController.handleCreateCar(mockRequest, mockResponse);
      
            expect(mockCarModel.create).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(car);
          });
      
          it("should call res.status(422) and res.json with task instance", async () => {
            const err = new Error("Something");
            const name = "Avanza";
            const price = 10000;  
            const size = "Large";  
            const image = "avanza.jpg"; 
            const isCurrentlyRented=  false;
      
            const mockRequest = {
              body: {
                name,
                price,
                size,
                image,
                isCurrentlyRented
              },
            };
      
            const mockCarModel = {
              create: jest.fn().mockReturnValue(Promise.reject(err)),
            };
      
            const mockResponse = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn().mockReturnThis(),
            };
      
            const carController = new CarController({ carModel: mockCarModel });
      
            await carController.handleCreateCar(mockRequest, mockResponse);
      
            expect(mockCarModel.create).toHaveBeenCalledWith({
                name,
                price,
                size,
                image,
                isCurrentlyRented
            });
            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
              error: {
                name: err.name,
                message: err.message,
              },
            });
          });
      
    })

    describe("#handleUpdateCar", () => {
      it("should call res.status(201) and res.json with car data", async () => {
        const name = "toyota";
        const price = 12000;
        const size = "medium";
        const image = "test.png";
        const isCurrentlyRented = false;
  
        const mockrequest = {
          params: {
            id: 1,
          },
          body: {
            name,
            price,
            size,
            image,
            isCurrentlyRented
          },
        };
  
        const mockCar = new Car({ name, price, size, image, isCurrentlyRented });
        mockCar.update = jest.fn().mockReturnThis();
  
        const mockCarModel = {
          findByPk: jest.fn().mockReturnValue(mockCar)
        };
  
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
  
        const carController = new CarController({ carModel: mockCarModel });
        await carController.handleUpdateCar(mockrequest, mockResponse);
  
        expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
        expect(mockCar.update).toHaveBeenCalledWith({ name, price, size, image, isCurrentlyRented });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockCar);
      });
  it("should call res.status(422) and res.json with error instance", async () => {
        const name = "toyota";
        const price = 12000;
        const size = "medium";
        const image = "test.png";
        const isCurrentlyRented = false;

        const err = new Error("Something");

  
        const mockRequest = {
          params: {
            id: 1,
          },
          body: {
            name,
            price,
            size,
            image,
            isCurrentlyRented
          },
        };
  
        const mockCarModel = {
          findByPk: jest.fn(() => Promise.reject(err))
        };
  
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
  
        const carController = new CarController({ carModel: mockCarModel });
        await carController.handleUpdateCar(mockRequest, mockResponse);
  
        expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(422);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: {
            name: err.name,
            mesage: err.message,
          },
        });
      });
    });

    describe("#handleDeleteCar", () =>{
        it("should call res.status(204)", async () => {
            const name = "Avanza";
            const prize = 10000;  
            const size = "Large";  
            const image = "avanza.jpg";  
      
            const mockRequest = {
                params: {
                  id: 1,
                },
              };
        
            const mockCar = new Car({ name, prize,size,image });
            mockCar.destroy = jest.fn();

            const mockCarModel = {};
            mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);  
      
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                end: jest.fn().mockReturnThis(),
              };
      
            const carController = new CarController({ carModel: mockCarModel });
            await carController.handleDeleteCar(mockRequest, mockResponse);
      
            expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
            expect(mockCar.destroy).toHaveBeenCalledWith();
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.end).toHaveBeenCalled();

        });

        it("should call res.status(404)", async () => {
          const err = new Error("Not found!");
         

          const mockCarModel = {};
          mockCarModel.findByPk = jest.fn().mockReturnValue(err);  
    
          const mockResponse = {
            status: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis(),
          };
    
          const carController = new CarController({ carModel: mockCarModel });
          await carController.handleDeleteCar(err, mockResponse);
    
          expect(mockResponse.status).toHaveBeenCalledWith(404);
          expect(mockResponse.end).toHaveBeenCalledWith();
      });
    })

   
    
})