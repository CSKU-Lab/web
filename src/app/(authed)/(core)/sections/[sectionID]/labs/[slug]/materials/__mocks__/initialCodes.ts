import type { LanguageMap } from "../../../../../../components/Editor/store/editor";

export const initialsCodes: LanguageMap = {
  c: `#include <stdio.h>
int main() {
    printf("Hello, World!");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
	System.out.println("Hello, World!");
    }
}`,
  python: `@@readonly@@
@@exclude@@{@@exclude@@
@@readonly@@`,
  javascript: `console.log("Hello, World!");`,
  typescript: `console.log("Hello, World!");`,
  ruby: `puts "Hello, World!"`,
  swift: `print("Hello, World!")`,
  go: `This text is editable

@@hidden@@This not seen in frontend@@hidden@@
@@readonly@@
package main
import "fmt"

@@exclude@@This not include in grader@@exclude@@ @@exclude@@This not include in grader@@exclude@@


func main() {
    @@editable@@fmt.Println("Hello, World!")@@editable@@
}

func add(@@editable@@\/*Edit code here*\/@@editable@@)@@editable@@\/*Edit code here*\/@@editable@@{
@@editable@@\/*Edit code here*\/@@editable@@
}
@@readonly@@

This text is editable`,
};
