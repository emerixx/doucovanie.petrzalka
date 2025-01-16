#include <iostream> 
#include <string>
#include <fmt/core.h>
#include <random>
using namespace std;



int rand(int min, int max) {
    static std::mt19937 eng(std::random_device{}()); // Static to maintain state across calls
    std::uniform_int_distribution<int> distr(min, max); // Define the distribution
    return distr(eng); // Generate and return the random number
}


string exponents(int n, float x1, float x2, float x3, float x4){
    string sa[n]={};
    string s ="";
    int x[4]={};
    int y;
    for (int i = 0; i < n; i++) {
        x[0]=rand(2, 5+ceil(x1*i));
        x[1]=rand(2, 2+ceil(x2*i));
        x[2]=rand(2, 5+ceil(x3*i));
        x[3]=rand(2, 2+ceil(x4*i));
        y=pow(x[0], x[1])+pow(x[2], x[3]);
        sa[i]= fmt::format("<div> <p style='font-size: 20px;'>\\( {}^{} + {}^{} = ? \\)</p> <details> <summary>Výsledok:</summary> <div> <p>\\( {}^{} + {}^{} = {} \\)</p> </div> </details> </div>", x[0], x[1], x[2], x[3], x[0], x[1], x[2], x[3], y);
    }
    for (int i = 0; i < n; i++) {
        s+=sa[i]+"\n";
    }
    return s;
    
}


int main() {
    cout << "Hello, World!" << std::endl; 
    cout << exponents(10, 1, 0.3, 1, 0.3);
    return 0; 
}

